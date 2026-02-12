import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { IconButton, Icon } from '@chakra-ui/react';
import {
    RepeatIcon,
    ArrowBackIcon,
    WarningIcon,
    SettingsIcon,
    CalendarIcon,
    InfoIcon
} from '@chakra-ui/icons';
import {
    MdDashboard,
    MdPeople,
    MdPayments,
    MdRemoveRedEye,
    MdLogout,
    MdAttachMoney,
    MdSmartphone
} from 'react-icons/md';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [stream, setStream] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/login');
            } else if (user.role !== 'admin') {
                navigate('/chat');
            }
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, activityRes, streamRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/activity'),
                    api.get('/admin/stream')
                ]);
                setStats(statsRes.data);
                setActivities(activityRes.data);
                setStream(streamRes.data);
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'admin') {
            fetchDashboardData();
        }
    }, [isAuthenticated, user]);

    if (authLoading || loading) {
        return <div className="loading-screen">Loading Admin Console...</div>;
    }

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>NexusAdmin</h2>
                    <p>Executive Console</p>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active">
                        <span className="nav-icon"><Icon as={MdDashboard} /></span>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon"><Icon as={MdPeople} /></span>
                        <span>Users</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon"><Icon as={MdPayments} /></span>
                        <span>Finance</span>
                    </a>
                    <a href="#" className="nav-item live">
                        <span className="nav-icon"><Icon as={MdRemoveRedEye} /></span>
                        <span>Live Monitor</span>
                        <span className="live-badge">LIVE</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon"><SettingsIcon /></span>
                        <span>Settings</span>
                    </a>
                    <button onClick={() => { logout(); navigate('/login'); }} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="nav-icon"><Icon as={MdLogout} /></span>
                        <span>Logout</span>
                    </button>
                </nav>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.displayName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="user-info">
                        <h4>{user.displayName}</h4>
                        <p>{user.role === 'admin' ? 'Super Admin' : user.role}</p>
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>Overview</h1>
                        <p>Real-time platform metrics and activity</p>
                    </div>
                    <Link to="/" className="back-btn"><ArrowBackIcon mr={2} /> Exit Admin</Link>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon revenue"><Icon as={MdAttachMoney} /></div>
                        <div className="stat-content">
                            <h3>{stats?.revenue.value}</h3>
                            <p>Total Revenue</p>
                            <span className="stat-change positive">{stats?.revenue.change}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon users"><Icon as={MdPeople} /></div>
                        <div className="stat-content">
                            <h3>{stats?.activeUsers.value}</h3>
                            <p>Active Users</p>
                            <span className="stat-change positive">{stats?.activeUsers.change}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon sessions"><Icon as={MdSmartphone} /></div>
                        <div className="stat-content">
                            <h3>{stats?.telegramSessions.value}</h3>
                            <p>Telegram Sessions</p>
                            <span className="stat-change positive">{stats?.telegramSessions.change}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon flags"><WarningIcon /></div>
                        <div className="stat-content">
                            <h3>{stats?.flaggedMessages.value}</h3>
                            <p>Flagged Messages</p>
                            <span className="stat-change negative">{stats?.flaggedMessages.change}</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="activity-panel">
                        <div className="panel-header">
                            <h3>Platform Activity</h3>
                            <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<RepeatIcon />}
                                onClick={() => window.location.reload()}
                                aria-label="Refresh"
                                className="refresh-btn"
                            />
                        </div>
                        <div className="activity-list">
                            {activities.map(activity => (
                                <div key={activity.id} className={`activity-item ${activity.status}`}>
                                    <div className="activity-user">
                                        <div className="activity-avatar">
                                            {activity.avatar_url ? <img src={activity.avatar_url} alt="" /> : activity.user.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="activity-info">
                                            <h4>{activity.user}</h4>
                                            <p>{activity.username}</p>
                                        </div>
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-action">{activity.action}</p>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                    {activity.status === 'flagged' && (
                                        <span className="flag-badge"><WarningIcon color="red.400" /></span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stream-panel">
                        <div className="panel-header">
                            <h3>Live Stream</h3>
                            <span className="pulse-indicator">●</span>
                        </div>
                        <div className="stream-content">
                            {stream.map((event, idx) => (
                                <div key={idx} className="stream-item">
                                    <span className="stream-time">{event.time}</span>
                                    <span className="stream-event">{event.event}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
