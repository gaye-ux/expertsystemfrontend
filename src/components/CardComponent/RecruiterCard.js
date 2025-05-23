const RecruiterCard = ({ recruiter }) => {
    return (
      <div className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between h-full min-h-[280px]">
        <div>
          <img
            src={recruiter.photoUrl}
            alt={recruiter.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="text-lg font-semibold text-center">{recruiter.name}</h3>
          <p className="text-gray-600 italic text-center">Looking for: {recruiter.interest}</p>
        </div>
        <a
          href={`/recruiters/${recruiter.id}`}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-center"
        >
          Contact Recruiter
        </a>
      </div>
    );
  };
  
  export default RecruiterCard;
  