import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiSearch, FiPaperclip, FiMic, FiSmile, FiMessageSquare } from 'react-icons/fi';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import MessageBubble from './MessageBubble';

const formatTime = (date) => {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date) => {
  if (!date) return '';
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const serializeData = (data) => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

const deserializeData = (jsonString) => {
  return JSON.parse(jsonString, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

const Messaging = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sortConversations = (conversations) => {
    return [...conversations].sort((a, b) => {
      const aLastMsg = a.messages[a.messages.length - 1]?.timestamp || a.createdAt;
      const bLastMsg = b.messages[b.messages.length - 1]?.timestamp || b.createdAt;
      return new Date(bLastMsg) - new Date(aLastMsg);
    });
  };

  const calculateTotalUnread = () => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  };

  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    setTotalUnreadCount(calculateTotalUnread());
  }, [unreadCounts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        loadUserConversations(user.uid);
        loadAllUsers();
      } else {
        setConversations([]);
        setAllUsers([]);
        setUnreadCounts({});
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `inbox_${currentUser?.uid}`) {
        loadUserConversations(currentUser.uid);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  const loadAllUsers = () => {
    try {
      const users = deserializeData(localStorage.getItem('all_users') || '[]');
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      setAllUsers([]);
    }
  };

  const loadUserConversations = (userId) => {
    try {
      const userInbox = deserializeData(localStorage.getItem(`inbox_${userId}`) || '[]');
      const sortedConversations = sortConversations(userInbox);
      setConversations(sortedConversations);
      
      const counts = {};
      sortedConversations.forEach(conv => {
        counts[conv.otherUserId] = conv.messages.filter(msg => 
          msg.sender !== userId && msg.status === 'unread'
        ).length;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
      setUnreadCounts({});
    }
  };

  const saveUserConversations = (userId, conversations) => {
    try {
      localStorage.setItem(`inbox_${userId}`, serializeData(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const registerUser = (user) => {
    try {
      const existingUsers = deserializeData(localStorage.getItem('all_users') || '[]');
      const userExists = existingUsers.find(u => u.uid === user.uid);
      
      if (!userExists) {
        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random`,
          lastSeen: new Date(),
          isOnline: true
        };
        
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem('all_users', serializeData(updatedUsers));
        setAllUsers(updatedUsers);
      } else {
        const updatedUsers = existingUsers.map(u => 
          u.uid === user.uid 
            ? { ...u, lastSeen: new Date(), isOnline: true }
            : u
        );
        localStorage.setItem('all_users', serializeData(updatedUsers));
        setAllUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const createOrGetConversation = (otherUser) => {
    const existingConv = conversations.find(conv => conv.otherUserId === otherUser.uid);
    if (existingConv) return existingConv;

    return {
      id: `${currentUser.uid}_${otherUser.uid}`,
      otherUserId: otherUser.uid,
      name: otherUser.displayName,
      avatar: otherUser.photoURL,
      lastSeen: otherUser.isOnline ? "Online" : (otherUser.lastSeen ? `Last seen ${formatTime(otherUser.lastSeen)}` : "Recently active"),
      messages: [],
      createdAt: new Date()
    };
  };

  const sendMessage = async (receiverId, messageText) => {
    if (!currentUser || !messageText.trim()) return;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    const newMessage = {
      id: messageId,
      text: messageText,
      sender: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      timestamp: timestamp,
      status: 'sent'
    };

    try {
      const senderConversations = [...conversations];
      let senderConvIndex = senderConversations.findIndex(conv => conv.otherUserId === receiverId);
      
      if (senderConvIndex === -1) {
        const receiverUser = allUsers.find(u => u.uid === receiverId);
        const newConv = createOrGetConversation(receiverUser);
        newConv.messages = [newMessage];
        senderConversations.push(newConv);
      } else {
        senderConversations[senderConvIndex].messages.push(newMessage);
      }

      const sortedConversations = sortConversations(senderConversations);
      setConversations(sortedConversations);
      saveUserConversations(currentUser.uid, sortedConversations);

      const receiverInbox = deserializeData(localStorage.getItem(`inbox_${receiverId}`) || '[]');
      let receiverConvIndex = receiverInbox.findIndex(conv => conv.otherUserId === currentUser.uid);

      const messageForReceiver = { ...newMessage, status: 'unread' };

      if (receiverConvIndex === -1) {
        const newReceiverConv = {
          id: `${receiverId}_${currentUser.uid}`,
          otherUserId: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          avatar: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=random`,
          lastSeen: "Recently active",
          messages: [messageForReceiver],
          createdAt: timestamp
        };
        receiverInbox.push(newReceiverConv);
      } else {
        receiverInbox[receiverConvIndex].messages.push(messageForReceiver);
        
        if (receiverId === currentUser.uid) {
          const newUnreadCount = receiverInbox[receiverConvIndex].messages.filter(
            msg => msg.sender !== currentUser.uid && msg.status === 'unread'
          ).length;
          setUnreadCounts(prev => ({
            ...prev,
            [currentUser.uid]: newUnreadCount
          }));
        }
      }

      localStorage.setItem(`inbox_${receiverId}`, serializeData(sortConversations(receiverInbox)));

      setTimeout(() => {
        const updatedConversations = conversations.map(conv => {
          if (conv.otherUserId === receiverId) {
            return {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === messageId ? { ...msg, status: 'delivered' } : msg
              )
            };
          }
          return conv;
        });
        const sortedUpdated = sortConversations(updatedConversations);
        setConversations(sortedUpdated);
        saveUserConversations(currentUser.uid, sortedUpdated);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    sendMessage(activeChat, input);
    setInput("");
  };

  const startConversation = (otherUser) => {
    if (otherUser.uid === currentUser.uid) return;

    const existingConv = conversations.find(conv => conv.otherUserId === otherUser.uid);
    
    if (existingConv) {
      setActiveChat(existingConv.otherUserId);
    } else {
      const newConv = createOrGetConversation(otherUser);
      const updatedConversations = sortConversations([...conversations, newConv]);
      setConversations(updatedConversations);
      saveUserConversations(currentUser.uid, updatedConversations);
      setActiveChat(newConv.otherUserId);
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    
    const updatedConversations = conversations.map(conv => {
      if (conv.otherUserId === chatId) {
        const unreadMessages = conv.messages.filter(msg => 
          msg.sender !== currentUser.uid && msg.status === 'unread'
        );
        
        if (unreadMessages.length > 0) {
          return {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.sender !== currentUser.uid ? { ...msg, status: 'read' } : msg
            )
          };
        }
        return conv;
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    saveUserConversations(currentUser.uid, updatedConversations);
    
    setUnreadCounts(prev => ({ 
      ...prev, 
      [chatId]: 0 
    }));
  };

  useEffect(() => {
    if (currentUser) {
      registerUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeChat, isTyping]);

  const activeConversation = conversations.find(c => c.otherUserId === activeChat);
  const toggleMessaging = () => setIsOpen(!isOpen);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableUsers = allUsers.filter(user => 
    user.uid !== currentUser?.uid &&
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          {totalUnreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalUnreadCount}
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
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button onClick={toggleMessaging} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
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

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === conversation.otherUserId ? "bg-blue-50" : ""}`}
                    onClick={() => handleChatSelect(conversation.otherUserId)}
                  >
                    <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">
                          {conversation.messages.length > 0 && formatTime(conversation.messages[conversation.messages.length - 1].timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.messages.length > 0 ? 
                            (conversation.messages[conversation.messages.length - 1].sender === currentUser.uid ? 
                              "You: " : "") + conversation.messages[conversation.messages.length - 1].text 
                            : "Start conversation"}
                        </p>
                        {unreadCounts[conversation.otherUserId] > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {unreadCounts[conversation.otherUserId]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {searchTerm && availableUsers.length > 0 && (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Start New Chat
                    </div>
                    {availableUsers.map(user => (
                      <div
                        key={user.uid}
                        className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                        onClick={() => startConversation(user)}
                      >
                        <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium">{user.displayName}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <>
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
                        isSender={message.sender === currentUser.uid}
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <FiMessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                    <p className="text-sm mt-2">Search for users to start a new chat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messaging;