import React, { useState } from "react";
import { FaCcVisa, FaPaypal, FaGooglePay, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentMethod = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get amount from state or default to 100
  const amount = location.state?.amount || 100;
  const currency = location.state?.currency || 'USD';
  const description = location.state?.description || 'Service Payment';

  const handlePayment = async (method) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to create payment session/order
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method,
          amount,
          currency,
          description,
          returnUrl: window.location.origin + '/payment-success',
          cancelUrl: window.location.origin + '/payment-cancel'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();
      
      // Redirect to the appropriate payment URL
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        redirectToPaymentSite(method);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Fallback to direct redirect on error
      redirectToPaymentSite(method);
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToPaymentSite = (method) => {
    const baseUrls = {
      "Credit/Debit Card": generateStripeUrl(),
      "PayPal": generatePayPalUrl(),
      "Google Pay": generateGooglePayUrl()
    };

    const url = baseUrls[method];
    if (url) {
      window.location.href = url;
    }
  };

  const generateStripeUrl = () => {
    
    return `https://checkout.stripe.com/pay?amount=${amount}&currency=${currency.toLowerCase()}`;
};

  const generatePayPalUrl = () => {
    const paypalParams = new URLSearchParams({
      cmd: '_xclick',
      business: 'your-paypal-business-email@example.com', 
      item_name: description,
      amount: amount,
      currency_code: currency,
      return: `${window.location.origin}/payment-success`,
      cancel_return: `${window.location.origin}/payment-cancel`,
      notify_url: `${window.location.origin}/api/paypal-ipn`
    });
    
    return `https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`;
  };

  const generateGooglePayUrl = () => {
    // Google Pay typically requires integration with Google Pay API
    // This is a simplified redirect - in practice, you'd use Google Pay's web integration
    const googlePayParams = new URLSearchParams({
      flow: 'payment',
      amount: amount,
      currency: currency,
      description: description
    });
    
    return `https://pay.google.com/gp/w/u/0/home/signup?${googlePayParams.toString()}`;
  };

  const paymentMethods = [
    {
      name: "Credit/Debit Card",
      icon: <FaCcVisa className="text-blue-800 text-xl" />,
      description: "Pay securely with your credit or debit card via Stripe"
    },
    {
      name: "PayPal",
      icon: <FaPaypal className="text-blue-600 text-xl" />,
      description: "Login to your PayPal account to complete payment"
    },
    {
      name: "Google Pay",
      icon: <FaGooglePay className="text-green-600 text-xl" />,
      description: "Pay quickly with your Google account"
    }
  ];

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 transition-colors"
          disabled={isProcessing}
        >
          <FaArrowLeft className="mr-1" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Payment Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{description}</span>
          <span className="text-xl font-bold text-gray-800">
            {currency} ${amount}
          </span>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Redirecting to payment...</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <button
            key={method.name}
            onClick={() => handlePayment(method.name)}
            disabled={isProcessing}
            className={`w-full p-4 border rounded-xl transition-all text-left hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
              isProcessing ? "border-gray-200 bg-gray-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{method.name}</span>
              {method.icon}
            </div>
            <p className="text-sm text-gray-600">{method.description}</p>
          </button>
        ))}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span className="text-sm text-green-800">
            Your payment is secured with 256-bit SSL encryption
          </span>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        You will be redirected to the secure payment site to complete your transaction. 
        You can return to this page after payment completion.
      </p>
    </div>
  );
};

export default PaymentMethod;