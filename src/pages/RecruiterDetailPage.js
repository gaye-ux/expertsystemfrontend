import { useParams } from 'react-router-dom';
import { users } from '../api/data';
import { useState, useEffect } from 'react';

const RecruiterDetailPage = () => {
  const { id } = useParams();
  const recruiter = users.find(user => user.id === Number(id) && user.role === 'recruiter');
  
  // State management for WhatsApp modal
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState("");

  // Clear error when message changes
  useEffect(() => {
    if (error && whatsappMessage.trim()) {
      setError("");
    }
  }, [whatsappMessage, error]);

  if (!recruiter) {
    return <div className="text-center p-8 text-red-600">Recruiter not found</div>;
  }

  const emailLink = `mailto:${recruiter.email}`;
  const defaultMessage = `Hi ${recruiter.name}, I found your profile on our platform and would like to connect.`;
  const whatsappLink = `https://wa.me/${recruiter.whatsapp}?text=${encodeURIComponent(whatsappMessage || defaultMessage)}`;

  const companyDescription = recruiter.companyDescription || "Leading recruitment agency specializing in placing top talent across tech, marketing, and business roles.";
  const industryFocus = recruiter.industryFocus || ["Technology", "Marketing", "Finance"];
  const yearsExperience = recruiter.yearsExperience || 8;
  const notableClients = recruiter.notableClients || ["Google", "Microsoft", "Amazon"];
  const currentOpeningsCount = recruiter.currentOpeningsCount || 12;
  const successRate = recruiter.successRate || "95%";

  const handleSendWhatsAppMessage = async () => {
    const trimmedMessage = whatsappMessage.trim();
    
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
          name: recruiter.name
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
    setIsModalOpen(true);
    setError("");
    setMessageSent(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setWhatsappMessage("");
    setMessageSent(false);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={recruiter.photoUrl}
          alt={recruiter.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/default-avatar.png'; // Fallback image
          }}
        />

        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{recruiter.name}</h1>
          <p className="text-lg font-semibold text-gray-700 mb-1">Recruiter</p>
          {recruiter.location && (
            <p className="text-gray-500 mb-4">Location: {recruiter.location}</p>
          )}

          <p className="mb-4 text-gray-700">{companyDescription}</p>

          <div className="mb-4">
            <h3 className="font-semibold text-xl mb-1">Industry Focus:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {industryFocus.map((industry, idx) => (
                <li key={idx}>{industry}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Experience:</span> {yearsExperience} years
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Notable Clients:</span> {notableClients.join(', ')}
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-lg text-green-700">
              Currently recruiting for {currentOpeningsCount} open positions
            </p>
          </div>

          <p className="mb-6 text-gray-700">
            <span className="font-semibold">Success Rate:</span> {successRate}
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact Recruiter</h2>
          <div className="flex flex-col gap-4">

            {recruiter.whatsapp && (
              <div className="flex gap-2">
                {/* Modal Option */}
                <button
                  onClick={handleOpenWhatsAppModal}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                >
                  <img
                    src="/whatsapp.jpg"
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />
                  Send WhatsApp Message
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

            {recruiter.email && (
              <a
                href={emailLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Recruiter
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced WhatsApp Modal */}
      {isModalOpen && (
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
                  Send a message to <strong className="text-gray-800">{recruiter.name}</strong>
                </p>
                <div className="relative">
                  <textarea
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    disabled={isLoading}
                    maxLength="1000"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {whatsappMessage.length}/1000
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
                    <p className="text-sm mt-1">The recruiter will receive your message shortly.</p>
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
                    disabled={isLoading || !whatsappMessage.trim()}
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

export default RecruiterDetailPage;