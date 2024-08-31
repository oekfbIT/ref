import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [authStatus, setAuthStatus] = useState(null); // Initialize to null

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    useEffect(() => {
        const refID = getCookie("refID");
        const authToken = getCookie("authToken");

        if (refID && authToken) {
            console.log("Cookie found: teamID and authToken exist.");
            setAuthStatus(true);
        } else {
            console.log("Cookie not found: teamID or authToken missing.");
            setAuthStatus(false);
        }
    }, []);

    if (authStatus === null) {
        // Render nothing or a loading state while checking cookies
        return null;
    }

    if (!authStatus) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
