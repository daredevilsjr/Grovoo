"use client";

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useStore";
import Profile from "../pages/Profile";
import DeliveryAgentProfile from "../pages/DAProfile";
import OrdersPage from "../pages/OrdersPage";
import ActiveOders from "../pages/ActiveOrders";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  rolebased = false,
  page = null,
}) => {
  const { user, loading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!adminOnly && rolebased) {
    if (page === "profile") {
      return RoleBasedProfile({
        elements: {
          Profile: <Profile />,
          DeliveryAgentProfile: <DeliveryAgentProfile />,
        },
        userRole: user.role,
      });
    }
    if (page === "orders") {
      return RoleBasedOders({
        elements: {
          OrdersPage: <OrdersPage />,
          ActiveOders: <ActiveOders />,
        },
        userRole: user.role,
      });
    }
  }

  // Check if admin access is required but user is not admin
  if (adminOnly && (user.role !== "admin" && user.role !== "owner")) {
    console.log(user.role);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Admin access
              required.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
const RoleBasedProfile = ({ elements, userRole }) => {
  // console.log("User Role:", userRole);
  // console.log("Elements:", elements);
  return userRole === "delivery" ? (
    elements.DeliveryAgentProfile
  ) : (userRole !== "admin" || userRole !== "owner") || userRole === "hotel" ? (
    elements.Profile
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
const RoleBasedOders = ({ elements, userRole }) => {
  // console.log("User Role:", userRole);
  // console.log("Elements:", elements);
  return userRole === "delivery" ? (
    elements.ActiveOders
  ) : (userRole !== "admin" || userRole !== "owner") || userRole === "hotel" ? (
    elements.OrdersPage
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
export default ProtectedRoute;
