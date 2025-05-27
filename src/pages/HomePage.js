import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaRegShareSquare,
  FaEllipsisH,
  FaSearch,
} from "react-icons/fa";
import { dummyFeeds } from "../api/dummyFeeds";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useSearch } from "../context/SearchContext";
import ProfilePage from "./ProfilePage";
import Messaging from "../components/MessageComponent/Messaging";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showProfileMobile, setShowProfileMobile] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

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

  const handleConnect = (id) => {
    setConnectionRequests((prev) => ({ ...prev, [id]: true }));
  };

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-700">QuickExpert</h1>
            <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1 w-64">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <FaRegCommentDots className="text-xl" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <FaRegThumbsUp className="text-xl" />
            </button>
            <img
              src={firebaseUser?.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="pt-16 pb-8 max-w-7xl mx-auto px-4 flex gap-6">
        {/* Left Column: Profile Sidebar */}
        <div className={`w-full lg:w-1/4 ${showProfileMobile ? "block" : "hidden"} lg:block`}>
          <div className="bg-white rounded-lg shadow-sm top-20 overflow-hidden">
            <ProfilePage />
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={firebaseUser?.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg"}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full py-2 px-4 text-left transition">
                Start a post
              </button>
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t">
              <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded">
                <FaRegThumbsUp className="mr-1" /> Like
              </button>
              <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded">
                <FaRegCommentDots className="mr-1" /> Comment
              </button>
              <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded">
                <FaRegShareSquare className="mr-1" /> Share
              </button>
            </div>
          </div>

          {/* Feed Posts */}
          {posts.map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              ref={index === posts.length - 1 ? lastPostRef : null}
              className="bg-white rounded-lg shadow-sm overflow-hidden mb-4"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{post.user.name}</h3>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-3">
                <p className="text-gray-800 mb-3">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg mb-3"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="px-4 py-2 border-t border-b text-sm text-gray-500 flex justify-between">
                <span>{likedPosts[post.id] ? post.likes + 1 : post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              <div className="flex justify-between px-4 py-2">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center px-3 py-1 rounded flex-1 justify-center ${
                    likedPosts[post.id]
                      ? "text-blue-600 bg-blue-100"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FaRegThumbsUp className="mr-2" /> {likedPosts[post.id] ? "Liked" : "Like"}
                </button>
                <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded flex-1 justify-center">
                  <FaRegCommentDots className="mr-2" /> Comment
                </button>
                <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded flex-1 justify-center">
                  <FaRegShareSquare className="mr-2" /> Share
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-1/4">
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
  <h3 className="font-medium text-gray-700 mb-3">People you may know</h3>
  <div className="space-y-3">
    {["Amat Gaye", "Musa Jobe", "Sehou Camara"].map((personName, index) => (
      <div key={personName} className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
            alt={`${personName}'s profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{personName}</span>
        </div>
        <button
          onClick={() => handleConnect(personName)}
          disabled={connectionRequests[personName]}
          className={`text-sm font-medium ${
            connectionRequests[personName]
              ? "text-gray-500 cursor-default"
              : "text-blue-600"
          }`}
        >
          {connectionRequests[personName] ? "Request Sent" : "Connect"}
        </button>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>

      
      <Messaging />
    </div>
  );
};

export default HomePage;
