import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-400 shadow z-50 ">
      {/* Logo of company*/}
      <div className="flex items-center space-x-2 text-xl font-bold text-blue-700 cursor-pointer">
        <span role="img" aria-label="charging">⚡</span>
        <Link to="/">
        <span>QuickExpert</span>
        </Link>
      </div>

      {/* Right side: Login and Signup */}
      <div className="flex space-x-4">
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </a>
        <a href="/signup" className="text-blue-600 hover:underline font-medium">
          Signup
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
