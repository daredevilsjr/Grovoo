"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Thank you for your message! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", mobile: "", message: "" });
    } else {
      toast.error("Failed to send message. Please try again.");
    }
  } catch (error) {
    toast.error("Server error. Please try again later.");
    console.error("Contact form error:", error);
  }

  setLoading(false);
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Contact & Support</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your mobile number"
                  />
                </div> 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <div className="loading-spinner"></div> : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-phone text-blue-600 w-6"></i>
                    <span className="ml-3">+91 7292980098</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-600 w-6"></i>
                    <span className="ml-3">support@1stopmandi.com</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-blue-600 w-6"></i>
                    <span className="ml-3">Boring Road, Shri Krishna Puri, Patna, Bihar 800001</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-blue-600 w-6"></i>
                    <span className="ml-3">Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">FAQ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800">What are your delivery hours?</h3>
                    <p className="text-gray-600 text-sm mt-1">We deliver between 6:00 AM - 10:00 PM on all days.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">What is the minimum order value?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Kindly contact us before order.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Do you accept returns?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Yes, we accept returns within 3 hours. No partial returns are allowed.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">How can I track my order?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      You can track your order status in the "My Orders" section after logging in.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Do you offer bulk discounts?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Yes, we offer special pricing for bulk orders. Contact us for more details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
