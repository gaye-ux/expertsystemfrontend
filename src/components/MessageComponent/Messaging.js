import React, { useState } from "react";
import { FaCommentDots, FaTimes, FaSearch, FaPaperclip, FaSmile } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

const Messaging = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastMessage: "Thanks for the help!",
      time: "10:30 AM",
      unread: 2,
      messages: [
        { text: "Hi there!", sender: "them", time: "10:25 AM" },
        { text: "I need some help with my project", sender: "them", time: "10:26 AM" },
        { text: "Sure, what do you need?", sender: "me", time: "10:28 AM" },
        { text: "Thanks for the help!", sender: "them", time: "10:30 AM" },
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastMessage: "Let's meet tomorrow",
      time: "Yesterday",
      unread: 0,
      messages: [
        { text: "About our meeting", sender: "them", time: "Yesterday" },
        { text: "Let's meet tomorrow", sender: "them", time: "Yesterday" }
      ]
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastMessage: "The files are ready",
      time: "2 days ago",
      unread: 0,
      messages: [
        { text: "When will the files be ready?", sender: "me", time: "2 days ago" },
        { text: "The files are ready", sender: "them", time: "2 days ago" }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation?.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { text: message, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) }
          ],
          lastMessage: message,
          time: "Just now"
        };
      }
      return conv;
    });
    
    setMessage("");
  };

  return (
    <div className="fixed sm:bottom-4 bottom-10 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-[30rem] bg-white shadow-xl rounded-lg flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="text-sm font-semibold">Messages</h2>
            <div className="flex items-center space-x-3">
              <button className="text-white hover:text-blue-200">
                <FaSearch className="text-sm" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200">
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* Inbox View */}
          {!activeConversation ? (
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${conversation.unread > 0 ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <img 
                      src={conversation.avatar} 
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Conversation View */
            <div className="flex flex-col h-full">
              {/* Conversation Header */}
              <div className="border-b p-3 flex items-center justify-between bg-white">
                <div className="flex items-center">
                  <button 
                    onClick={() => setActiveConversation(null)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <img 
                    src={activeConversation.avatar} 
                    alt={activeConversation.name}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <h3 className="text-sm font-medium">{activeConversation.name}</h3>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <BsThreeDotsVertical />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                <div className="space-y-2">
                  {activeConversation.messages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs p-3 rounded-lg text-sm ${msg.sender === 'me' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 rounded-bl-none'}`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-3 bg-white">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-gray-700 mx-2">
                    <FaPaperclip />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 mr-2">
                    <FaSmile />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    <IoMdSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
          <FaCommentDots className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
      )}
    </div>
  );
};

export default Messaging;