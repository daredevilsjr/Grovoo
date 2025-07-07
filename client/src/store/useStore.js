import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import axios from "axios";

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      selectedLocation: "mumbai",
      loading: true,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      },
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setLoading: (loading) => set({ loading }),

      login: async (email, password, phone) => {
        try {
          set({ loading: true });
          const response = await axios.post("/api/auth/login", {
            email,
            password,
            phone,
          });
          const { token, user } = response.data;

          // Set token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
          if(user.role === "deliveryAgent") {
            toast.success("Login successful! Please complete your profile.");
            return { success: true, redirectPath: "/agent-profile" };
          }
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || "Login failed";
          return { success: false, message };
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true });
          const response = await axios.post("/api/auth/register", userData);
          const { token, user } = response.data;

          // Set token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message =
            error.response?.data?.message || "Registration failed";
          return { success: false, message };
        }
      },

      agentRegister: async (userData) => {
        try {
          const response = await axios.post(
            "/api/auth/agent/register",
            userData
          );
          const { token, user } = response.data;

          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          toast.success("Registration successful!");
          return { success: true };
        } catch (error) {
          const message =
            error.response?.data?.message || "Registration failed";
          toast.error(message);
          return { success: false, message };
        }
      },

      logout: () => {
        delete axios.defaults.headers.common["Authorization"];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      updateLocation: (location) => {
        set({ selectedLocation: location });
      },

      // Initialize auth state
      initializeAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ loading: false, isAuthenticated: false });
          return;
        }

        try {
          // Set token in axios headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Verify token with backend
          const response = await axios.get("/api/auth/me");
          const user = response.data.user;

          set({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error("Token verification failed:", error);
          // Clear invalid token
          delete axios.defaults.headers.common["Authorization"];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);

// Products Store
export const useProductsStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "all",
    sortBy: "name",
  },

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  addProduct: (product) => {
    const { products } = get();
    set({ products: [...products, product] });
  },

  updateProduct: (productId, updatedProduct) => {
    const { products } = get();
    set({
      products: products.map((product) =>
        product._id === productId ? updatedProduct : product
      ),
    });
  },

  deleteProduct: (productId) => {
    const { products } = get();
    set({ products: products.filter((product) => product._id !== productId) });
  },
}));

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item._id === product._id);

        // Get the latest product stock from products store
        const products = useProductsStore.getState().products;
        const productInStore = products.find((p) => p._id === product._id);

        // Debug logs
        if (!productInStore) {
          console.warn("Product not found in products store:", product._id);
          return;
        }

        const stock =
          typeof productInStore.stock === "number" ? productInStore.stock : 0;

        // If no stock, do not add
        if (stock <= 0) {
          console.warn("Product has no stock:", product._id);
          return;
        }

        let newQuantity = quantity;
        if (existingItem) {
          newQuantity = existingItem.quantity + quantity;
        }
        if (newQuantity > stock) {
          toast.error("Max Quantity Reached");
        } else {
          toast.success(
            <div className="flex items-center">
              <span>{product.name} added to cart!</span>
            </div>
          );
        }
        // Clamp to available stock
        newQuantity = Math.min(newQuantity, stock);

        // Do not add if clamped quantity is less than 1
        if (newQuantity < 1) {
          console.warn("Attempted to add less than 1 quantity:", product._id);
          return;
        }

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: newQuantity }] });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item._id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        const products = useProductsStore.getState().products;
        const productInStore = products.find((p) => p._id === productId);

        // Debug logs
        if (!productInStore) {
          console.warn(
            "Product not found in products store (update):",
            productId
          );
          get().removeFromCart(productId);
          return;
        }

        const stock =
          typeof productInStore.stock === "number" ? productInStore.stock : 0;

        // Remove if no stock or requested quantity is less than 1
        if (stock <= 0 || quantity < 1) {
          console.warn("No stock or quantity < 1 (update):", productId);
          get().removeFromCart(productId);
          return;
        }

        // Clamp quantity to available stock
        if (quantity >= stock) {
          toast.error("Max Quantity Reached");
        }
        const clampedQuantity = Math.min(quantity, stock);

        set({
          cart: cart.map((item) =>
            item._id === productId
              ? { ...item, quantity: clampedQuantity }
              : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: (location) => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          return total + item.price[location] * item.quantity;
        }, 0);
      },

      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  showMobileMenu: false,
  showUserMenu: false,
  showAddProductModal: false,
  uploadingImage: false,

  setShowMobileMenu: (show) => set({ showMobileMenu: show }),
  setShowUserMenu: (show) => set({ showUserMenu: show }),
  setShowAddProductModal: (show) => set({ showAddProductModal: show }),
  setUploadingImage: (uploading) => set({ uploadingImage: uploading }),

  toggleMobileMenu: () =>
    set((state) => ({ showMobileMenu: !state.showMobileMenu })),
  toggleUserMenu: () => set((state) => ({ showUserMenu: !state.showUserMenu })),
}));
