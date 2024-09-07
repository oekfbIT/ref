import React, { createContext, useContext, useState } from 'react';

// Create the context
const MinuteContext = createContext();

// Create a provider component
export const MinuteProvider = ({ children }) => {
    const [minute, setMinute] = useState(0);  // Holds the current minute

    return (
        <MinuteContext.Provider value={{ minute, setMinute }}>
            {children}
        </MinuteContext.Provider>
    );
};

// Hook to use the minute context
export const useMinute = () => useContext(MinuteContext);
