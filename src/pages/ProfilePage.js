import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FiUser } from "react-icons/fi";

const ProfilePage = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!firebaseUser) {
    return (
      <div className="pt-24 text-center text-gray-500">Loading profile...</div>
    );
  }

  // Static LinkedIn-style attributes
  const profileData = {
    jobTitle: "Full Stack Developer",
    location: "Banjul, Gambia",
    experience: [
      {
        role: "Frontend Developer",
        company: "Tech Solutions Ltd.",
        duration: "Jan 2021 - Present",
        description:
          "Developed scalable web interfaces using React and Tailwind CSS.",
      },
      {
        role: "Software Engineer Intern",
        company: "InnovateX",
        duration: "Jun 2020 - Dec 2020",
        description: "Assisted in building REST APIs and microservices.",
      },
    ],
    education: {
      institution: "University of Oxford",
      degree: "BSc Computer Science",
      year: "2016 - 2020",
    },
    expertise: ["React", "Node.js", "Spring Boot", "TypeScript", "MySQL"],
    skills: ["Problem Solving", "Team Collaboration", "Agile Development"],
  };

  return (
    <div className="pt-24 px-4 max-w-3xl mx-auto">
      <div className="bg-gray-200 shadow-md rounded-xl p-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden mb-4">
            <img
              src={`https://randomuser.me/api/portraits/${
                Math.random() > 0.5 ? "men" : "women"
              }/${Math.floor(Math.random() * 100)}.jpg`}
              alt="User profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg"; // Fallback image
              }}
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {firebaseUser.displayName || "Anonymous User"}
          </h2>
          <p className="text-gray-600">{firebaseUser.email}</p>
          <p className="text-sm text-gray-500 mt-1">{profileData.jobTitle}</p>
          <p className="text-sm text-gray-500">{profileData.location}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Experience</h3>
          <ul className="space-y-4">
            {profileData.experience.map((item, index) => (
              <li key={index}>
                <p className="font-semibold">
                  {item.role} at {item.company}
                </p>
                <p className="text-sm text-gray-600">{item.duration}</p>
                <p className="text-sm text-gray-700">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Education</h3>
          <p className="font-semibold">{profileData.education.institution}</p>
          <p className="text-sm text-gray-600">
            {profileData.education.degree}
          </p>
          <p className="text-sm text-gray-600">{profileData.education.year}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.expertise.map((tech, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
