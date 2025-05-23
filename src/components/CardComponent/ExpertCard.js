const ExpertCard = ({ expert }) => {
    return (
      <div className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between h-full min-h-[320px]">
        <div>
          <img
            src={expert.photoUrl}
            alt={expert.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="text-lg font-bold text-center">{expert.name}</h3>
          <p className="text-gray-600 text-center">{expert.expertise}</p>
          <p className="text-sm text-gray-500 text-center">{expert.price}</p>
          <p
            className={`text-sm text-center ${
              expert.status === "offline" ? "text-red-500" : "text-green-500"
            }`}
          >
            {expert.status}
          </p>
        </div>
        <a
          href={`/experts/${expert.id}`}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
        >
          Connect Now
        </a>
      </div>
    );
  };
  
  export default ExpertCard;