import React from "react";
import { users } from "../api/data";
import ExpertCard from "../components/CardComponent/ExpertCard";
import ProfessionalCard from "../components/CardComponent/ProfessionalCard";
import RecruiterCard from "../components/CardComponent/RecruiterCard";
import JobSeekerCard from "../components/CardComponent/JobSeekerCard";
import { useSearch } from "../context/SearchContext";

const CardsPage = () => {
  const { searchQuery } = useSearch();

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.title?.toLowerCase().includes(query) ||
      user.description?.toLowerCase().includes(query)||
      user.interest?.toLowerCase().includes(query)||
      user.interest?.toLowerCase().includes(query)||
      user.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="pt-28 p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Get Expert Help in Minutes And Recruit the Best Professionals
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => {
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
