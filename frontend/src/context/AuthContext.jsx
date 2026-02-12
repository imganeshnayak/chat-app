import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('vesper_user');
        const token = localStorage.getItem('vesper_token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            checkSession();
        } else {
            setLoading(false);
        }
    }, []);

    const checkSession = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            localStorage.setItem('vesper_user', JSON.stringify(response.data));
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;

        localStorage.setItem('vesper_token', token);
        localStorage.setItem('vesper_user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    const loginWithTelegram = async (authData) => {
        const response = await api.post('/auth/telegram', { auth_data: authData });
        const { user, token } = response.data;

        localStorage.setItem('vesper_token', token);
        localStorage.setItem('vesper_user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    const logout = () => {
        localStorage.removeItem('vesper_token');
        localStorage.removeItem('vesper_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithTelegram, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
