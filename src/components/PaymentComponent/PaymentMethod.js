import React, { useState } from "react";
import { FaCcVisa, FaPaypal, FaGooglePay, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handlePayment = (method) => setSelectedMethod(method);
  const closeModal = () => setSelectedMethod(null);
  const confirmPayment = () => {
    alert(`Processing ${selectedMethod} payment...`);
    closeModal();
  };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const renderFields = () => {
    switch (selectedMethod) {
      case "Credit/Debit Card":
        return (
          <div className="space-y-3">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-3">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                onChange={handleChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                onChange={handleChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              name="cardName"
              placeholder="Name on Card"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "PayPal":
        return (
          <div className="space-y-3">
            <input
              type="email"
              name="paypalEmail"
              placeholder="PayPal Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="paypalPassword"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "Google Pay":
        return (
          <div className="space-y-3">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="googleEmail"
              placeholder="Google Account Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <FaArrowLeft className="mr-1" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
      </div>

      <div className="space-y-3">
        {["Credit/Debit Card", "PayPal", "Google Pay"].map((method) => (
          <button
            key={method}
            onClick={() => handlePayment(method)}
            className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all ${
              selectedMethod === method 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span className="font-medium text-gray-700">{method}</span>
            {method === "Credit/Debit Card" && <FaCcVisa className="text-blue-800 text-xl" />}
            {method === "PayPal" && <FaPaypal className="text-blue-600 text-xl" />}
            {method === "Google Pay" && <FaGooglePay className="text-green-600 text-xl" />}
          </button>
        ))}
      </div>

      {selectedMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedMethod}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {renderFields()}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={confirmPayment}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;