import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaRegShareSquare,
  FaUserCircle,
  FaArrowLeft,
  FaTimes
} from "react-icons/fa";
import { dummyFeeds } from "../api/dummyFeeds";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useSearch } from "../context/SearchContext";
import CardsPage from "./CardsPage";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const feedContainerRef = useRef(null);

  const observer = useRef();
  const postsPerPage = 5;

  useEffect(() => {
    setPosts(dummyFeeds.slice(0, postsPerPage));
    setPage(1);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  const loadMorePosts = useCallback(() => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      const start = page * postsPerPage;
      const end = start + postsPerPage;

      let newPosts = [];

      if (start >= dummyFeeds.length) {
        newPosts = dummyFeeds.slice(0, postsPerPage);
        setPage(1);
      } else {
        newPosts = dummyFeeds.slice(start, end);
        setPage((prev) => prev + 1);
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setLoading(false);
    }, 1000);
  }, [loading, page]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadMorePosts]
  );

  const { searchQuery } = useSearch();

  {searchQuery && (
    <div>
      <CardsPage />
    </div>
  )}
  

  return (
    <div className="relative min-h-screen bg-gray-50">

      {/* Profile Icon Button */}
      <button
        className={`fixed top-[69px] left-4 z-50 bg-gray-400 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ${
          showProfile ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setShowProfile(true)}
      >
        <FaUserCircle className="text-2xl text-blue-600" />
      </button>

      {/* Profile Slide-in Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transition-all duration-300 transform ${
          showProfile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
          <button
            onClick={() => setShowProfile(false)}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
              <FaUserCircle className="text-blue-500 text-5xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {firebaseUser?.displayName || "Anonymous"}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{firebaseUser?.email}</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">Account Settings</h4>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800">Notifications</h4>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800">Help Center</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={feedContainerRef}
        className={`transition-all duration-300 min-h-screen pt-16 pb-10 ${
          showProfile ? "ml-80" : "ml-0"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4">
          {/* Feed Header */}
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            Latest Trends on Tech
          </h1>

          {/* Feed Posts */}
          {posts.map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              ref={index === posts.length - 1 ? lastPostRef : null}
              className="bg-white shadow-sm rounded-xl p-5 mb-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <h2 className="text-md font-semibold text-gray-800">
                    {post.user.name}
                  </h2>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-800 mb-3 whitespace-pre-line">
                {post.content}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post visual"
                  className="w-full rounded-lg mb-3 object-cover h-64"
                  loading="lazy"
                />
              )}

              {/* Stats */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-2">
                <span>{post.likes} Likes</span>
                <span>{post.comments} Comments</span>
              </div>

              {/* Actions */}
              <div className="flex justify-around mt-3 pt-3 border-t border-gray-100 text-gray-600 text-sm font-medium">
                <button className="flex items-center gap-2 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaRegThumbsUp className="text-base" /> Like
                </button>
                <button className="flex items-center gap-2 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaRegCommentDots className="text-base" /> Comment
                </button>
                <button className="flex items-center gap-2 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  <FaRegShareSquare className="text-base" /> Share
                </button>
              </div>
            </div>
          ))}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;