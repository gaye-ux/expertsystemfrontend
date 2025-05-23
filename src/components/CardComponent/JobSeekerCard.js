const JobSeekerCard = ({ seeker }) => {
    return (
      <div className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between h-full min-h-[280px]">
        <div>
          <img
            src={seeker.photoUrl}
            alt={seeker.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="text-lg font-semibold text-center">{seeker.name}</h3>
          <p className="text-gray-600 italic text-center">Seeking: {seeker.interest}</p>
        </div>
        <a
          href={`/job_seekers/${seeker.id}`}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
        >
          Send Resume
        </a>
      </div>
    );
  };
  
  export default JobSeekerCard;