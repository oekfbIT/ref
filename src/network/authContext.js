import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from './AuthService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const authService = new AuthService();

    useEffect(() => {
        if (authService.isAuthenticated()) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            setIsAuthenticated(true);
        } else {
            toast.error(result.message);
        }
        return result;
    };

    const logout = () => {
        authService.logoutUser();
        setIsAuthenticated(false);
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
