import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Token #14 Ready Soon',
      message: 'Token #12 is currently in consultation with Dr. S. Sundararajan (TVMCH). Please proceed towards OPD Block A.',
      time: '5 mins ago',
      read: false,
      type: 'queue'
    },
    {
      id: 'notif-2',
      title: 'Tirunelveli Health Advisory',
      message: 'Monsoon viral fever OPD triage counters are now active 24/7 across TVMCH and Shifa Hospital.',
      time: '1 hour ago',
      read: true,
      type: 'info'
    },
    {
      id: 'notif-3',
      title: 'Appointment Confirmed',
      message: 'Your slot at Aravind Eye Hospital is booked for 09:40 AM today.',
      time: '2 hours ago',
      read: true,
      type: 'booking'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    toast(title + ': ' + message, { icon: '🔔' });
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Notifications cleared');
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
