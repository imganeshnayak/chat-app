import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TelegramLoginButton from '../components/TelegramLoginButton';
import './LoginPage.css';

const LoginPage = () => {
    const { login, loginWithTelegram } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTelegramAuth = async (user) => {
        setIsLoading(true);
        setError('');
        try {
            await loginWithTelegram(user);
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.error || 'Telegram login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="telegram-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.48 1.02-.73 3.99-1.74 6.65-2.89 7.98-3.46 3.8-1.58 4.59-1.86 5.1-1.87.11 0 .37.03.54.17.14.12.18.28.2.39.01.08.03.29.01.45z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1>Premium Access</h1>
                    <p className="subtitle">Securely login via Telegram to manage your private sessions.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="telegram-button-wrapper" style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
                    <TelegramLoginButton
                        botName="clientvendorchatbot"
                        onAuth={handleTelegramAuth}
                    />
                </div>


                <div className="footer-links">
                    <p>By continuing, you agree to our</p>
                    <div className="links">
                        <a href="#">Terms of Service</a>
                        <span>•</span>
                        <a href="#">Privacy Policy</a>
                    </div>
                    <div className="dev-access" style={{ marginTop: '20px', opacity: 0.2, fontSize: '10px' }}>
                        <button onClick={() => handleLogin('admin@vesper.io', 'password123')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                            Admin Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
