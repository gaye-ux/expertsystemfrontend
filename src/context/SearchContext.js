import React, { createContext, useState, useContext } from "react";

// Create the context
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = () => useContext(SearchContext);
