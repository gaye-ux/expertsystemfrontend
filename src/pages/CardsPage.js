import React from "react";
import { users } from "../api/data";
import ExpertCard from "../components/CardComponent/ExpertCard";
import ProfessionalCard from "../components/CardComponent/ProfessionalCard";
import RecruiterCard from "../components/CardComponent/RecruiterCard";
import JobSeekerCard from "../components/CardComponent/JobSeekerCard";

const CardsPage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Get Expert Help in Minutes And Recruit the best professionals</h1>
      <input
        type="text"
        placeholder="What do you need help with?"
        className="w-full p-3 mb-6 border rounded-lg"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {users.map((user) => {
          switch (user.role) {
            case "expert":
              return <ExpertCard key={user.id} expert={user} />;
            case "professional":
              return <ProfessionalCard key={user.id} professional={user} />;
            case "recruiter":
              return <RecruiterCard key={user.id} recruiter={user} />;
            case "job_seeker":
              return <JobSeekerCard key={user.id} seeker={user} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default CardsPage;
