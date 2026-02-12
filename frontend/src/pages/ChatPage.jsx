import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateChatId } from '../utils/chat';
import { IconButton, Tooltip, Avatar } from '@chakra-ui/react';
import {
    PhoneIcon,
    AddIcon,
    AttachmentIcon,
    ArrowBackIcon,
    DragHandleIcon
} from '@chakra-ui/icons';
import {
    MdLogout,
    MdVideocam
} from 'react-icons/md';
import './ChatPage.css';

const ChatPage = () => {
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && user) {
            socket.on('newMessage', (message) => {
                if (message.chatId === selectedChat?.chat_id) {
                    setMessages((prev) => [...prev, message]);
                }
                // Update chat preview in the list
                setChats((prev) =>
                    prev.map(chat =>
                        chat.chat_id === message.chatId
                            ? { ...chat, last_message: message.content, last_message_time: message.createdAt }
                            : chat
                    )
                );
            });

            socket.on('userOnline', ({ userId, online }) => {
                // Update online status in UI if needed
            });
        }
    }, [socket, user, selectedChat]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get('/messages/chats/list');
                setChats(response.data);
                if (response.data.length > 0 && !selectedChat) {
                    setSelectedChat(response.data[0]);
                }
            } catch (err) {
                console.error('Error fetching chats:', err);
            }
        };

        if (isAuthenticated) {
            fetchChats();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const response = await api.get(`/messages/${selectedChat.chat_id}`);
                    setMessages(response.data);
                    // Join socket room
                    socket?.emit('join', { userId: user.id, chatId: selectedChat.chat_id });
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            }
        };

        if (selectedChat && socket) {
            fetchMessages();
        }
    }, [selectedChat, socket, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const response = await api.get(`/users/search?q=${searchQuery}`);
                    setSearchResults(response.data);
                } catch (err) {
                    console.error('Search error:', err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const selectUserFromSearch = (targetUser) => {
        const chatId = generateChatId(user.id, targetUser.id);

        // Check if chat already exists in our list
        const existingChat = chats.find(c => c.chat_id === chatId);

        if (existingChat) {
            setSelectedChat(existingChat);
        } else {
            // Create a temporary chat object
            const tempChat = {
                chat_id: chatId,
                user_id: targetUser.id,
                display_name: targetUser.displayName,
                username: targetUser.username,
                avatar_url: targetUser.avatarUrl,
                last_message: 'Start a conversation...',
                last_message_time: new Date().toISOString(),
                unread_count: 0
            };
            setChats(prev => [tempChat, ...prev]);
            setSelectedChat(tempChat);
        }
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageData = {
            sender_id: user.id,
            receiver_id: selectedChat.user_id,
            chat_id: selectedChat.chat_id,
            content: newMessage,
            message_type: 'text'
        };

        try {
            // Using socket for immediate delivery and database persistence (handled in backend socket handler)
            socket.emit('message', messageData);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    if (authLoading || !user) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Tooltip label="Logout">
                            <IconButton
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                icon={<MdLogout />}
                                onClick={() => { logout(); navigate('/login'); }}
                                aria-label="Logout"
                            />
                        </Tooltip>
                        <IconButton
                            size="sm"
                            colorScheme="purple"
                            borderRadius="full"
                            icon={<AddIcon size="12px" />}
                            aria-label="New Chat"
                        />
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                        <div className="search-results-dropdown">
                            {searchResults.map(result => (
                                <div
                                    key={result.id}
                                    className="search-result-item"
                                    onClick={() => selectUserFromSearch(result)}
                                >
                                    <Avatar size="xs" name={result.displayName} src={result.avatarUrl} />
                                    <div className="search-result-info">
                                        <h5>{result.displayName}</h5>
                                        <p>@{result.username}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="chat-list">
                    {chats.map(chat => (
                        <div
                            key={chat.chat_id}
                            className={`chat-item ${selectedChat?.chat_id === chat.chat_id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="chat-avatar">
                                {chat.avatar_url ? <img src={chat.avatar_url} alt="" /> : chat.display_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="chat-info">
                                <div className="chat-header-row">
                                    <h4>{chat.display_name}</h4>
                                    <span className="chat-time">{new Date(chat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="chat-preview-row">
                                    <p className="chat-preview">{chat.last_message}</p>
                                    {chat.unread_count > 0 && <span className="unread-badge">{chat.unread_count}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main">
                {selectedChat ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <div className="chat-avatar large">
                                    {selectedChat.avatar_url ? <img src={selectedChat.avatar_url} alt="" /> : selectedChat.display_name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3>{selectedChat.display_name}</h3>
                                    <p className="status">Online via Telegram</p>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <IconButton size="sm" variant="ghost" icon={<PhoneIcon />} aria-label="Call" />
                                <IconButton size="sm" variant="ghost" icon={<MdVideocam size="20px" />} aria-label="Video Call" />
                                <IconButton size="sm" variant="ghost" icon={<DragHandleIcon />} aria-label="More" />
                            </div>
                        </div>

                        <div className="messages-container">
                            {messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                                    <div className="message-bubble">
                                        <p>{msg.content}</p>
                                        {msg.attachmentUrl && (
                                            <div className="attachment">
                                                <AttachmentIcon mr={2} />
                                                <a href={msg.attachmentUrl} target="_blank" rel="noreferrer">{msg.attachmentName}</a>
                                            </div>
                                        )}
                                        <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="message-input-container" onSubmit={handleSendMessage}>
                            <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<AttachmentIcon />}
                                aria-label="Attach File"
                                type="button"
                                className="attach-btn"
                            />
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
                                </svg>
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            <div className="chat-info-panel">
                {selectedChat && (
                    <>
                        <div className="user-profile">
                            <div className="profile-avatar">
                                {selectedChat.avatar_url ? <img src={selectedChat.avatar_url} alt="" /> : selectedChat.display_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h3>{selectedChat.display_name}</h3>
                            <p className="username">@{selectedChat.username}</p>
                        </div>

                        <div className="info-section">
                            <h4>Information</h4>
                            <div className="info-item">
                                <span>Status</span>
                                <p>Verified via Telegram</p>
                            </div>
                        </div>
                    </>
                )}
                <Link to="/" className="back-link">
                    <ArrowBackIcon mr={2} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ChatPage;
