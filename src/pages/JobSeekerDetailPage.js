import { useParams } from 'react-router-dom';
import { users } from '../api/data';
import { useState } from 'react';


const JobSeekerDetailPage = () => {

const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { id } = useParams();
  const jobSeeker = users.find(user => user.id === Number(id) && (user.role === 'job_seeker' || user.role === 'jobseeker'));

  if (!jobSeeker) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold text-xl">
        Job Seeker not found.
      </div>
    );
  }

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
          name: jobSeeker.name
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-8">
        <img
          src={jobSeeker.photoUrl}
          alt={jobSeeker.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-md mx-auto md:mx-0"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/160';
          }}
        />
        <div className="mt-4 md:mt-0 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900">{jobSeeker.name}</h1>
          <p className="text-xl text-indigo-600 mt-1 font-semibold">
            {jobSeeker.jobTitle || 'Job Seeker'}
          </p>
          {jobSeeker.location && (
            <div className="flex items-center text-gray-500 mt-2 text-sm md:text-base">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {jobSeeker.location}
            </div>
          )}
          {jobSeeker.availability && (
            <div className="mt-2">
              <span className={`px-2 py-1 text-lg rounded-full ${
                jobSeeker.availability === 'Immediately available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {jobSeeker.availability}
              </span>
            </div>
          )}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3 border-b-2 border-indigo-500 inline-block pb-1">
          About Me
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {jobSeeker.bio || jobSeeker.interest || "Passionate and motivated candidate looking to contribute and grow."}
        </p>
      </section>

      {jobSeeker.skills && jobSeeker.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b-2 border-indigo-500 inline-block pb-1">
            Skills
          </h2>
          <ul className="flex flex-wrap gap-3">
            {jobSeeker.skills.map((skill, index) => (
              <li
                key={index}
                className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}

      {jobSeeker.experience && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-500 inline-block pb-1">
            {typeof jobSeeker.experience === 'string' ? 'Experience' : 'Work Experience'}
          </h2>
          {typeof jobSeeker.experience === 'string' ? (
            <p className="text-gray-700 whitespace-pre-line">{jobSeeker.experience}</p>
          ) : (
            jobSeeker.experience.map((job, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {job.title} <span className="text-indigo-600 font-medium">— {job.company}</span>
                </h3>
                <p className="italic text-gray-500 mb-2">{job.dates}</p>
                {job.details && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {job.details.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {jobSeeker.education && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b-2 border-indigo-500 inline-block pb-1">
            Education & Certifications
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{jobSeeker.education}</p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-500 inline-block pb-1">
          Contact
        </h2>
        <div className="flex flex-col gap-3 text-gray-800">
          {jobSeeker.email && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a
                href={`mailto:${jobSeeker.email}`}
                className="text-indigo-600 hover:underline"
              >
                {jobSeeker.email}
              </a>
            </div>
          )}
          {jobSeeker.whatsapp && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <button onClick={openWhatsAppModal} className="text-green-600 hover:underline">
              <a>
                {jobSeeker.whatsapp}
              </a>
              </button>
              
            </div>
          )}
          {jobSeeker.linkedin && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <a
                href={jobSeeker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                {jobSeeker.linkedin.includes('linkedin.com') ? 'LinkedIn Profile' : jobSeeker.linkedin}
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => alert('Time shared with the candidate')}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Schedule Interview
        </button>
        <button
          onClick={() => alert('CV will be downloaded')}
          className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition"
        >
          Download Resume
        </button>
      </section>

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
                Send a message to <strong>{jobSeeker.name}</strong>
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

export default JobSeekerDetailPage;