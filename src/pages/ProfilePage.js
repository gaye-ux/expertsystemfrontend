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

  return (
    <div className="pt-24 px-4 max-w-sm mx-auto">
      <div className="bg-white shadow-md rounded-xl p-6 text-center">
        <div className="w-24 h-24 rounded-full mx-auto bg-blue-100 flex items-center justify-center mb-4">
          <FiUser className="text-blue-500 text-4xl" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          {firebaseUser.displayName || "Anonymous User"}
        </h2>
        <p className="text-gray-600 mt-1">{firebaseUser.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
