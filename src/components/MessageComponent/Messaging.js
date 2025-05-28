import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiSearch, FiPaperclip, FiMic, FiSmile, FiMessageSquare } from 'react-icons/fi';
import MessageBubble from './MessageBubble';

const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = (date) => date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

const Messaging = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({ 1: 0, 2: 3, 3: 1 });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastSeen: "Online",
      messages: [
        { text: "Hey, how's the project going?", sender: "them", timestamp: new Date(Date.now() - 3600000), status: "read" },
        { text: "Almost done with my part!", sender: "me", timestamp: new Date(Date.now() - 1800000), status: "read" },
      ],
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastSeen: "Last seen today at 2:45 PM",
      messages: [
        { text: "Did you see the new design mockups?", sender: "them", timestamp: new Date(Date.now() - 86400000), status: "unread" },
        { text: "Not yet, are they in Figma?", sender: "me", timestamp: new Date(Date.now() - 82800000), status: "read" },
        { text: "Yes, I'll send you the link", sender: "them", timestamp: new Date(Date.now() - 81000000), status: "unread" },
      ],
    },
    {
      id: 3,
      name: "Team Project",
      avatar: "https://randomuser.me/api/portraits/lego/5.jpg",
      lastSeen: "5 members",
      messages: [
        { text: "Meeting at 3pm tomorrow", sender: "them", timestamp: new Date(Date.now() - 172800000), status: "read" },
        { text: "I'll be there", sender: "me", timestamp: new Date(Date.now() - 169200000), status: "read" },
      ],
    },
  ]);

  const activeConversation = conversations.find(c => c.id === activeChat) || conversations[0];

  const getRandomReply = (message) => {
    const lowerMsg = message.toLowerCase();
  
    // Extract main keyword from message
    let keyword = null;
    if (lowerMsg.includes("project")) keyword = "project";
    else if (lowerMsg.includes("design")) keyword = "design";
    else if (lowerMsg.includes("meeting")) keyword = "meeting";
    else if (lowerMsg.includes("figma")) keyword = "figma";
    else if (lowerMsg.includes("link")) keyword = "link";
    else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) keyword = "greeting";
  
    switch (keyword) {
      case "project":
        return "I'm excited about the project too!";
      case "design":
        return "I’ll check the designs now.";
      case "meeting":
        return "Yes, I’ll be on time.";
      case "figma":
        return "Thanks, I’ll open it right away.";
      case "link":
        return "Got the link, opening it!";
      case "greeting":
        return "Hey! How are you doing?";
      default:
        // More relevant fallback replies based on message content
  
        if (lowerMsg.endsWith("?")) {
          return "That's a good question, let me think about it.";
        }
  
        if (lowerMsg.includes("thank") || lowerMsg.includes("thanks")) {
          return "You're welcome! Happy to help.";
        }
  
        if (lowerMsg.includes("sorry")) {
          return "No worries at all!";
        }
  
        // General casual fallback replies (only 2-3)
        const fallbackReplies = [
          "Sounds good to me!",
          "I'll get back to you on that.",
          "Let me check and get back to you.",
        ];
        return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }
  };
  

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      sender: "me",
      timestamp: new Date(),
      status: "sent"
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === activeChat
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    );

    setConversations(updatedConversations);
    setInput("");

    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage = {
          text: getRandomReply(input),
          sender: "them",
          timestamp: new Date(),
          status: "delivered"
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeChat
              ? { ...conv, messages: [...conv.messages, replyMessage] }
              : conv
          )
        );
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    setUnreadCounts(prev => ({ ...prev, [chatId]: 0 }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation.messages, isTyping]);

  const toggleMessaging = () => {
    setIsOpen(!isOpen);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Floating Message Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          {Object.values(unreadCounts).reduce((a, b) => a + b, 0) > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
            </div>
          )}
          <button
            onClick={toggleMessaging}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiMessageSquare size={24} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-full max-w-lg h-[80vh] bg-gray-50 rounded-lg shadow-xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button onClick={toggleMessaging} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Main */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === conversation.id ? "bg-blue-50" : ""}`}
                    onClick={() => handleChatSelect(conversation.id)}
                  >
                    <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.messages.at(-1).timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.messages.at(-1).text}
                        </p>
                        {unreadCounts[conversation.id] > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {unreadCounts[conversation.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                <div className="flex items-center">
                  <img src={activeConversation.avatar} alt={activeConversation.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="ml-3">
                    <h3 className="font-medium">{activeConversation.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 text-gray-500">
                  <button className="hover:text-gray-700"><FiSearch size={18} /></button>
                  <button className="hover:text-gray-700"><FiMoreVertical size={18} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                <div className="text-center mb-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {formatDate(new Date())}
                  </span>
                </div>

                {activeConversation.messages.map((message, idx) => (
                  <MessageBubble
                    key={idx}
                    message={message.text}
                    isSender={message.sender === "me"}
                    timestamp={message.timestamp}
                    status={message.status}
                  />
                ))}

                {isTyping && (
                  <div className="flex mb-3 justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-lg rounded-tl-none px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 mx-1"><FiPaperclip size={18} /></button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="w-full pl-3 pr-10 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      <FiSmile size={18} />
                    </button>
                  </div>
                  <button className="ml-1 text-gray-500 hover:text-gray-700 mx-1" onClick={handleSend}>
                    {input.trim() ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    ) : (
                      <FiMic size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messaging;
