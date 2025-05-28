import React from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ message, isSender, timestamp, status }) => {
  return (
    <div className={`flex mb-3 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
          isSender
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <div className="text-sm">{message}</div>
        <div className={`text-xs mt-1 flex items-center justify-end ${isSender ? "text-blue-100" : "text-gray-500"}`}>
          {formatTime(timestamp)}
          {isSender && (
            <span className="ml-1">
              <IoCheckmarkDone className={status === "read" ? "text-blue-300" : "text-gray-400"} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;