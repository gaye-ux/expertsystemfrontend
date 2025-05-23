const ProfessionalCard = ({ professional }) => {
    return (
      <div className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between h-full min-h-[280px]">
        <div>
          <img
            src={professional.photoUrl}
            alt={professional.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="text-lg font-semibold text-center">{professional.name}</h3>
          <p className="text-center text-black font-semibold">Job Title: {professional.jobTitle}</p>
          <p className="text-gray-600 italic text-center">Needs: {professional.interest}</p>
        </div>
        <a
          href={`/professionals/${professional.id}`}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
        >
          Request Advice
        </a>
      </div>
    );
  };
  
  export default ProfessionalCard;
  