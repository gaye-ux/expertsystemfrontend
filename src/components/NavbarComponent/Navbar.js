import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // Debounce navigation on searchQuery changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/users?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }, 1000); // 1 sec debounce time

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, navigate]);

  // Optional manual search button click handler
  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/users?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-400 shadow px-4 py-3 flex items-center justify-between flex-wrap">
      {/* Left: Logo */}
      <div className="flex items-center text-xs sm:text-xl font-bold text-blue-700">
        <span role="img" aria-label="charging" className="mr-1">
          ⚡
        </span>
        <Link to="/">QuickExpert</Link>
      </div>

      {/* Center: Search bar */}
      <div className="mx-auto w-full sm:w-auto sm:flex-1 max-w-md px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search experts, posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-500 text-sm" />
          <button
            type="button"
            onClick={handleManualSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center space-x-3 text-xs sm:text-base mt-2 sm:mt-0">
        {!user ? (
          <>
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 font-medium">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="flex flex-col items-center gap-0 text-white font-medium"
            >
              <FaUserCircle size={20} />
              {user.displayName?.split(" ")[0] || user.email}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
