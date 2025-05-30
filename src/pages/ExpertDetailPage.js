import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { users } from "../api/data";

const ExpertDetailPage = () => {
  const { id } = useParams();
  const expert = users.find(
    (user) => user.id === Number(id) && user.role === "expert"
  );

  const navigate = useNavigate();

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  if (!expert) {
    return <div>Expert no more information found</div>;
  }

  const emailLink = `mailto:${expert.email}`;

  // Add WhatsApp message handler
  const handleSendWhatsAppMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          name: expert.name
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessageSent(true);
        setTimeout(() => {
          setShowWhatsAppModal(false);
          setMessage("");
          setMessageSent(false);
        }, 2000);
      } else {
        alert("Failed to send message: " + result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsAppModal = () => {
    setShowWhatsAppModal(true);
  };

  const closeWhatsAppModal = () => {
    setShowWhatsAppModal(false);
    setMessage("");
    setMessageSent(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      {/* FLEX LAYOUT FOR TEXT + IMAGE */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{expert.name}</h1>
          <p className="text-lg mb-1">Expertise: {expert.expertise}</p>
          <p className="text-lg mb-1">Price: {expert.price}</p>
          <p
            className={`text-lg mb-4 ${
              expert.status === "offline" ? "text-red-500" : "text-green-500"
            }`}
          >
            Status: {expert.status}
          </p>
          <h3 className="font-bold text-2xl">Professional Experience</h3>
          <p className="text-black">{expert.experience}</p>
        </div>
        <img
          src={expert.photoUrl}
          alt={expert.name}
          className="w-40 h-40 object-cover rounded-xl"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Contact Options</h2>
      <div className="flex flex-col gap-4">
        {expert.whatsapp && (
          <button
            onClick={openWhatsAppModal}
            className="flex items-center gap-3 px-4 py-3 border rounded hover:bg-green-100 transition"
          >
            <img src="/whatsapp.jpg" alt="WhatsApp" className="w-6 h-6" />
            <span>Chat on WhatsApp</span>
          </button>
        )}

        {expert.email && (
          <a
            href={emailLink}
            className="flex items-center gap-3 px-4 py-3 border rounded hover:bg-blue-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Send Email</span>
          </a>
        )}

        {expert.status === "offline" && (
          <button
            onClick={() => alert("Appointment Booked")}
            className="px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Book an Appointment
          </button>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate("/payment")}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 1.343-3 3v3m0 0c0 1.657 1.343 3 3 3s3-1.343 3-3m-3 3v-3m0 0v-3m-6 6H6a2 2 0 01-2-2V9a2 2 0 012 2h12a2 2 0 012 2v6a2 2 0 01-2 2h-1"
              />
            </svg>
            <span>Proceed to Payment</span>
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Your transaction is encrypted and secure.
          </p>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Send WhatsApp Message</h3>
              <button
                onClick={closeWhatsAppModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Send a message to <strong>{expert.name}</strong>
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                disabled={isLoading}
              />
            </div>

            {messageSent ? (
              <div className="text-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Message sent successfully!
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={closeWhatsAppModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendWhatsAppMessage}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <img src="/whatsapp.jpg" alt="WhatsApp" className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDetailPage;