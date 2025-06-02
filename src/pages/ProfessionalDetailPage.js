import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { users } from "../api/data";

const ProfessionalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find professional with better error handling
  const professional = users.find(
    (user) => user.id === Number(id) && user.role === "professional"
  );

  // State management for WhatsApp modal
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState("");

  // Clear error when message changes
  useEffect(() => {
    if (error && message.trim()) {
      setError("");
    }
  }, [message, error]);

  // Early return for missing professional
  if (!professional) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Professional Not Found</h1>
          <p className="text-gray-600 mb-6">
            The professional you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSendWhatsAppMessage = async () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      setError("Please enter a message");
      return;
    }

    if (trimmedMessage.length > 1000) {
      setError("Message is too long. Please keep it under 1000 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          name: professional.name
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setMessageSent(true);
        // Auto-close modal after success
        const timer = setTimeout(() => {
          handleCloseModal();
        }, 2000);
        
        return () => clearTimeout(timer);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWhatsAppModal = () => {
    setShowWhatsAppModal(true);
    setError("");
    setMessageSent(false);
  };

  const handleCloseModal = () => {
    setShowWhatsAppModal(false);
    setMessage("");
    setMessageSent(false);
    setError("");
  };

  const handleRequestExpertAdvice = () => {
    const confirmed = window.confirm(
      `Request expert advice for ${professional.name}? This will notify available experts about this request.`
    );
    if (confirmed) {
      alert("Expert advice request submitted successfully! Experts will be notified.");
    }
  };

  const whatsappLink = professional.whatsapp
    ? `https://wa.me/${professional.whatsapp}`
    : null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <img
            src={professional.photoUrl}
            alt={`${professional.name}'s profile`}
            className="w-32 h-32 rounded-lg object-cover shadow-md"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/default-avatar.png'; // Fallback image
            }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{professional.name}</h1>
          <p className="text-xl text-gray-600 mb-3">
            {professional.jobTitle ||
              professional.interest ||
              "Seeking Expert Advice"}
          </p>
          {professional.location && (
            <p className="text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {professional.location}
            </p>
          )}
        </div>
      </div>

      {/* Help Needed Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">What help is needed?</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {professional.description ||
              "This professional is looking for expert advice or solutions. If you are an expert, you can reach out using the contact options below."}
          </p>
        </div>
      </div>

      {/* Skills/Interests Section (if available) */}
      {professional.skills && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Skills & Interests</h3>
          <div className="flex flex-wrap gap-2">
            {professional.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Options */}
      <div className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Options</h2>
        <div className="space-y-4">
          {professional.whatsapp && (
            <div className="flex gap-2">
              {/* Modal Option */}
              <button
                onClick={handleOpenWhatsAppModal}
                className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
              >
                <img src="/whatsapp.jpg" alt="WhatsApp" className="w-6 h-6" />
                <span className="font-medium text-gray-700 group-hover:text-green-700">
                  Send WhatsApp Message
                </span>
              </button>
              
              {/* Direct Link Option */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border-2 border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                title="Open WhatsApp directly"
              >
                <svg className="w-6 h-6 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          )}

          {/* Email Contact */}
          {professional.email && (
            <a
              href={`mailto:${professional.email}?subject=Professional Inquiry&body=Hello ${professional.name}, I saw your profile and would like to connect.`}
              className="w-full flex items-center gap-3 px-4 py-3 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 group-hover:text-blue-700"
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
              <span className="font-medium text-gray-700 group-hover:text-blue-700">
                Send Email
              </span>
            </a>
          )}

         
        </div>
      </div>

      {/* Enhanced WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Send WhatsApp Message</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Send a message to <strong className="text-gray-800">{professional.name}</strong>
                </p>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    disabled={isLoading}
                    maxLength="1000"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {message.length}/1000
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {messageSent ? (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Message sent successfully!
                    </div>
                    <p className="text-sm mt-1">The professional will receive your message shortly.</p>
                  </div>
                </div>
              ) : (
                /* Action Buttons */
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendWhatsAppMessage}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default ProfessionalDetailPage;