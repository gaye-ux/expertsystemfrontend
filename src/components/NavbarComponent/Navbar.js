import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(window.scrollY);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/users?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, navigate]);

  // Handle scroll to hide bottom menu
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > prevScrollY) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      setPrevScrollY(currentY);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrollingDown(false); // show again when scrolling stops
      }, 2000);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-white px-4 py-2 shadow-md flex justify-between items-center">
        <Link to="/profile" className="text-gray-700">
          <FaUserCircle size={24} />
        </Link>
        <div className="flex-1 mx-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden sm:flex fixed top-0 left-0 right-0 z-40 bg-white shadow-md px-6 py-3 items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-700 flex items-center">
          ⚡ QuickExpert
        </Link>
        <div className="relative w-1/2 max-w-lg">
          <input
            type="text"
            placeholder="Search experts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <FaUserCircle size={20} />
                <span className="hidden md:inline">{user.displayName?.split(" ")[0] || user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Menu - Hide on scroll */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
          isScrollingDown ? "translate-y-full" : "translate-y-0"
        } bg-white shadow-inner py-2 px-4 flex justify-between items-center`}
      >
        <Link to="/" className="text-lg font-bold text-blue-700 flex items-center">
          ⚡ QuickExpert
        </Link>
        {!user ? (
          <div className="flex gap-3">
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-1 rounded-full text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
