import React, { useEffect, useRef } from 'react';

const TelegramLoginButton = ({ botName, onAuth, dataSize = 'large', requestAccess = 'write' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.src = `https://telegram.org/js/telegram-widget.js?22`;
        script.async = true;

        // Telegram attributes
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', dataSize);
        script.setAttribute('data-request-access', requestAccess);

        // Define the global callback function
        window.onTelegramAuth = (user) => {
            onAuth(user);
        };
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');

        // Append script to our container
        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            // Clean up
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            delete window.onTelegramAuth;
        };
    }, [botName, onAuth, dataSize, requestAccess]);

    return <div ref={containerRef} id="telegram-login-container" />;
};

export default TelegramLoginButton;
