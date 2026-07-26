import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Award, MessageSquare, X } from 'lucide-react';

export default function NotificationsPanel({ notifications, setNotifications, darkMode }) {
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismiss = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'badge':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getNotificationColor = (type, read) => {
    if (read) return darkMode ? 'bg-slate-900/20' : 'bg-slate-50';

    switch (type) {
      case 'status':
        return darkMode ? 'bg-blue-600/10 border-blue-500/30' : 'bg-blue-50 border-blue-200';
      case 'resolved':
        return darkMode ? 'bg-green-600/10 border-green-500/30' : 'bg-green-50 border-green-200';
      case 'badge':
        return darkMode ? 'bg-yellow-600/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200';
      case 'announcement':
        return darkMode ? 'bg-purple-600/10 border-purple-500/30' : 'bg-purple-50 border-purple-200';
      case 'comment':
        return darkMode ? 'bg-orange-600/10 border-orange-500/30' : 'bg-orange-50 border-orange-200';
      default:
        return darkMode ? 'bg-slate-900/20' : 'bg-slate-50';
    }
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-4 ${
      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className={`text-xs font-semibold transition-colors ${
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleMarkAsRead(notification.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                getNotificationColor(notification.type, notification.read)
              } ${!notification.read ? 'border' : 'border-transparent'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-sm">{notification.title}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(notification.id);
                      }}
                      className={`flex-shrink-0 p-1 rounded hover:bg-slate-400/20 transition-colors ${
                        darkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className={`text-sm mb-2 line-clamp-2 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {notification.message}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell className={`h-12 w-12 mx-auto mb-3 opacity-20`} />
            <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              No notifications yet
            </p>
          </div>
        )}
      </div>

      {/* View All Notifications Link */}
      {notifications.length > 0 && (
        <button className={`w-full py-2 text-center font-semibold text-sm rounded-lg transition-colors ${
          darkMode
            ? 'text-blue-400 hover:bg-blue-600/10'
            : 'text-blue-600 hover:bg-blue-50'
        }`}>
          View All Notifications
        </button>
      )}
    </div>
  );
}
