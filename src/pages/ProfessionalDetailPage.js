import { useParams } from "react-router-dom";
import { users } from "../api/data";

const ProfessionalDetailPage = () => {
  const { id } = useParams();
  const professional = users.find(
    (user) => user.id === Number(id) && user.role === "professional"
  );

  if (!professional) {
    return <div>Professional not found or no additional info available.</div>;
  }

  const whatsappLink = professional.whatsapp
    ? `https://wa.me/${professional.whatsapp}`
    : null;
  const emailLink = professional.email ? `mailto:${professional.email}` : null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex items-center mb-6">
        <img
          src={professional.photoUrl}
          alt={professional.name}
          className="w-32 h-32 rounded-lg object-cover mr-6"
          loading="lazy"
        />
        <div>
          <h1 className="text-3xl font-bold">{professional.name}</h1>
          {/* Job title or main interest */}
          <p className="text-xl text-gray-700 mt-1">
            {professional.jobTitle ||
              professional.interest ||
              "Seeking Expert Advice"}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">What help is needed?</h2>
      <p className="mb-6 text-gray-700">
        {professional.description ||
          "This professional is looking for expert advice or solutions. If you are an expert, you can reach out using the contact options below."}
      </p>

      <h2 className="text-2xl font-semibold mb-4">Contact Options</h2>
      <div className="flex flex-col gap-4 max-w-sm">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 border rounded hover:bg-green-100 transition"
          >
            <img src="/whatsapp.jpg" alt="WhatsApp" className="w-6 h-6" />
            <span>Chat on WhatsApp</span>
          </a>
        )}

        {emailLink && (
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

        <button
          onClick={() => alert("Request Transferred Successfully")}
          className="px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Request Expert Advice
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetailPage;
