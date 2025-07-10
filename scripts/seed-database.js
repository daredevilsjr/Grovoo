// const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")
// const User = require("../models/User")
// const Product = require("../models/Product")
// require("dotenv").config()

// const seedDatabase = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/1StopMandi")
//     console.log("Connected to MongoDB")

//     // Clear existing data
//     await User.deleteMany({})
//     await Product.deleteMany({})
//     console.log("Cleared existing data")

//     // Create admin user
//     const adminPassword = await bcrypt.hash("password123", 10)
//     const admin = new User({
//       name: "Admin User",
//       email: "admin@1StopMandi.com",
//       password: adminPassword,
//       role: "admin",
//       phone: "+91 98765 43210",
//       address: "123 Admin Street, patna",
//       location: "patna",
//     })
//     await admin.save()

//     // Create hotel user
//     const hotelPassword = await bcrypt.hash("password123", 10)
//     const hotel = new User({
//       name: "Hotel Manager",
//       email: "hotel@test.com",
//       password: hotelPassword,
//       role: "hotel",
//       phone: "+91 98765 43211",
//       address: "456 Hotel Avenue, patna",
//       location: "patna",
//     })
//     await hotel.save()

//     console.log("Created users")

//     // Sample products
//     const products = [
//       {
//         name: "Fresh Tomatoes",
//         description: "Fresh red tomatoes, perfect for cooking and salads",
//         category: "Vegetables",
//         stock: 100,
//         unit: "kg",
//         price: { patna: 45, delhi: 42, bangalore: 48 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Basmati Rice",
//         description: "Premium quality basmati rice, aged for perfect aroma",
//         category: "Grains",
//         stock: 50,
//         unit: "kg",
//         price: { patna: 120, delhi: 115, bangalore: 125 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Fresh Chicken Breast",
//         description: "Fresh chicken breast, boneless and skinless",
//         category: "Non-Veg",
//         stock: 25,
//         unit: "kg",
//         price: { patna: 280, delhi: 275, bangalore: 285 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Extra Virgin Olive Oil",
//         description: "Premium extra virgin olive oil, cold pressed",
//         category: "Oils",
//         stock: 30,
//         unit: "liter",
//         price: { patna: 450, delhi: 440, bangalore: 460 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Fresh Cow Milk",
//         description: "Fresh cow milk, pasteurized and homogenized",
//         category: "Dairy",
//         stock: 80,
//         unit: "liter",
//         price: { patna: 55, delhi: 52, bangalore: 58 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Turmeric Powder",
//         description: "Pure turmeric powder, ground from fresh turmeric",
//         category: "Spices",
//         stock: 40,
//         unit: "kg",
//         price: { patna: 180, delhi: 175, bangalore: 185 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Fresh Onions",
//         description: "Fresh red onions, perfect for cooking",
//         category: "Vegetables",
//         stock: 75,
//         unit: "kg",
//         price: { patna: 35, delhi: 32, bangalore: 38 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Fresh Bananas",
//         description: "Fresh ripe bananas, rich in potassium",
//         category: "Fruits",
//         stock: 60,
//         unit: "kg",
//         price: { patna: 40, delhi: 38, bangalore: 42 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Paneer",
//         description: "Fresh cottage cheese, made from pure milk",
//         category: "Dairy",
//         stock: 20,
//         unit: "kg",
//         price: { patna: 300, delhi: 290, bangalore: 310 },
//         createdBy: admin._id,
//       },
//       {
//         name: "Green Tea",
//         description: "Premium green tea leaves, antioxidant rich",
//         category: "Beverages",
//         stock: 35,
//         unit: "kg",
//         price: { patna: 800, delhi: 780, bangalore: 820 },
//         createdBy: admin._id,
//       },
//     ]

//     await Product.insertMany(products)
//     console.log("Created sample products")

//     console.log("Database seeded successfully!")
//     console.log("\nDemo Accounts:")
//     console.log("Admin: admin@1StopMandi.com / password123")
//     console.log("Hotel: hotel@test.com / password123")

//     process.exit(0)
//   } catch (error) {
//     console.error("Error seeding database:", error)
//     process.exit(1)
//   }
// }

// seedDatabase()
