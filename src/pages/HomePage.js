import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  const [searchText, setSearchText] = useState("");
  const [shareMenuOpenFor, setShareMenuOpenFor] = useState(null);


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

  const handleConnect = (id) => {
    setConnectionRequests((prev) => ({
      ...prev,
      [id]: !prev[id],  
    }));
  };

  const shareToFacebook = (post) => {
    const url = encodeURIComponent(post.url || window.location.href);
    const text = encodeURIComponent(post.content || "");
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    window.open(fbShareUrl, "_blank", "noopener,noreferrer");
    setShareMenuOpenFor(null);
  };
  
  const shareToWhatsApp = (post) => {
    const text = encodeURIComponent(post.content + " " + (post.url || window.location.href));
    const waShareUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waShareUrl, "_blank", "noopener,noreferrer");
    setShareMenuOpenFor(null);
  };
  
  const handleShare = (postId) => {
    setShareMenuOpenFor(prev => (prev === postId ? null : postId));
  };  

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Filter posts based on searchText (case insensitive) in post content or user name
  const filteredPosts = searchText
    ? dummyFeeds.filter(
        (post) =>
          post.content.toLowerCase().includes(searchText.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : posts;

    const memoizedProfilePage = useMemo(() => <ProfilePage />, []);

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
              src={
                firebaseUser?.photoURL ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="pt-16 pb-8 max-w-7xl mx-auto px-4 flex gap-6">
        {/* Left Column: Profile Sidebar */}
        <div
          className={`w-full lg:w-1/4 ${
            showProfileMobile ? "block" : "hidden"
          } lg:block`}
        >
          <div className="bg-white rounded-lg shadow-sm top-20 overflow-hidden">
            {memoizedProfilePage}
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto">
          {/* Post - SEARCH BAR * TO SEARCH FO A POST*/}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={
                  firebaseUser?.photoURL ||
                  "https://randomuser.me/api/portraits/lego/1.jpg"
                }
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="Search posts..."
                className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* Feed Posts */}
          {filteredPosts.map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              ref={
                !searchText && index === filteredPosts.length - 1
                  ? lastPostRef
                  : null
              }
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
 <div className="relative flex-1 flex justify-center">
  <button
    onClick={() => handleShare(post.id)}
    className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg flex-1 justify-center transition-colors duration-200"
  >
    <FaRegShareSquare className="mr-2 text-lg" />
    <span className="text-sm font-medium">Share</span>
  </button>

  {/* Share options popup */}
  {shareMenuOpenFor === post.id && (
    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[180px]">
      <div className="flex space-x-4 px-4 py-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            shareToFacebook(post);
          }}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Facebook
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            shareToWhatsApp(post);
          }}
          className="text-green-600 hover:text-green-800 font-medium text-sm"
        >
          WhatsApp
        </button>
      </div>
    </div>
  )}
</div>
              </div>
            </div>
          ))}

          {loading && !searchText && (
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
              alt={personName}
              className="w-8 h-8 rounded-full"
            />
            <span>{personName}</span>
          </div>
          <button
            onClick={() => handleConnect(personName)}
            className={`px-2 py-1 text-sm rounded ${
              connectionRequests[personName]
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {connectionRequests[personName] ? "Requested" : "Connect"}
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
