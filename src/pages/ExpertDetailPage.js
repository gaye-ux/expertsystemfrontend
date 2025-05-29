import { useParams, useNavigate } from "react-router-dom";
import { users } from "../api/data";

const ExpertDetailPage = () => {
  const { id } = useParams();
  const expert = users.find(
    (user) => user.id === Number(id) && user.role === "expert"
  );

  const navigate = useNavigate();

  if (!expert) {
    return <div>Expert no more information found</div>;
  }

  const whatsappLink = `https://wa.me/${expert.whatsapp}`;
  const emailLink = `mailto:${expert.email}`;

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
                d="M12 8c-1.657 0-3 1.343-3 3v3m0 0c0 1.657 1.343 3 3 3s3-1.343 3-3m-3 3v-3m0 0v-3m-6 6H6a2 2 0 01-2-2V9a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2h-1"
              />
            </svg>
            <span>Proceed to Payment</span>
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Your transaction is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;
