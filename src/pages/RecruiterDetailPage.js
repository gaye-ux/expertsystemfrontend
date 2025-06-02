import { useParams } from 'react-router-dom';
import { users } from '../api/data';
import { useState } from 'react';

const RecruiterDetailPage = () => {
  const { id } = useParams();
  const recruiter = users.find(user => user.id === Number(id) && user.role === 'recruiter');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  if (!recruiter) {
    return <div className="text-center p-8 text-red-600">Recruiter not found</div>;
  }

  const baseWhatsappUrl = `https://wa.me/${recruiter.whatsapp}`;
  const whatsappLinkWithMessage = `${baseWhatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`;
  const emailLink = `mailto:${recruiter.email}`;

  const companyDescription = recruiter.companyDescription || "Leading recruitment agency specializing in placing top talent across tech, marketing, and business roles.";
  const industryFocus = recruiter.industryFocus || ["Technology", "Marketing", "Finance"];
  const yearsExperience = recruiter.yearsExperience || 8;
  const notableClients = recruiter.notableClients || ["Google", "Microsoft", "Amazon"];
  const currentOpeningsCount = recruiter.currentOpeningsCount || 12;
  const successRate = recruiter.successRate || "95%";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Profile Image */}
        <img
          src={recruiter.photoUrl}
          alt={recruiter.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow"
        />

        {/* Main Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{recruiter.name}</h1>
          <p className="text-lg font-semibold text-gray-700 mb-1">Recruiter</p>
          {recruiter.location && (
            <p className="text-gray-500 mb-4">Location: {recruiter.location}</p>
          )}

          {/* Company */}
          <p className="mb-4 text-gray-700">{companyDescription}</p>

          {/* Industry Focus */}
          <div className="mb-4">
            <h3 className="font-semibold text-xl mb-1">Industry Focus:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {industryFocus.map((industry, idx) => (
                <li key={idx}>{industry}</li>
              ))}
            </ul>
          </div>

          {/* Experience & Notable Clients */}
          <div className="mb-4">
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Experience:</span> {yearsExperience} years in recruitment
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Notable Clients:</span> {notableClients.join(", ")}
            </p>
          </div>

          {/* Current Openings */}
          <div className="mb-4">
            <p className="font-semibold text-lg text-green-700">
              Currently recruiting for {currentOpeningsCount} open positions
            </p>
          </div>

          {/* Success Rate */}
          <p className="mb-6 text-gray-700">
            <span className="font-semibold">Success Rate:</span> {successRate} placements
          </p>

          {/* Contact Section */}
          <h2 className="text-2xl font-bold mb-4">Contact Recruiter</h2>
          <div className="flex flex-col gap-4">

            {/* WhatsApp Message Input and Button */}
            {recruiter.whatsapp && (
              <>
                <input
                  type="text"
                  placeholder="Type your message to recruiter..."
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <a
                  href={whatsappLinkWithMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                >
                  <img
                    src="/whatsapp.jpg"
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />
                  Chat on WhatsApp
                </a>
              </>
            )}

            {/* Email Button */}
            {recruiter.email && (
              <a
                href={emailLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Recruiter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDetailPage;
