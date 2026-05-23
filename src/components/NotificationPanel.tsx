import { useState } from 'react'
import { X, Check, Trash2, Bell } from 'lucide-react'
import { useNotifications, getNotificationIcon } from '../context/NotificationContext'
import type { Notification } from '../context/NotificationContext'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!isOpen) return null

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="fixed right-4 top-20 w-96 max-h-[80vh] glass-strong rounded-2xl border border-white/10 overflow-hidden z-50 shadow-2xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-400" />
          <h3 className="font-bold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            filter === 'unread'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Unread
        </button>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={markAllAsRead}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
            title="Mark all as read"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Clear all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={() => markAsRead(notification.id)}
                onClear={() => clearNotification(notification.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationItem({
  notification,
  onMarkRead,
  onClear,
  formatTime,
}: {
  notification: Notification
  onMarkRead: () => void
  onClear: () => void
  formatTime: (timestamp: number) => string
}) {
  return (
    <div
      className={`p-4 hover:bg-white/5 transition-all cursor-pointer ${
        !notification.read ? 'bg-emerald-500/5' : ''
      }`}
      onClick={onMarkRead}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
          <p className="text-xs text-slate-500 mt-2">{formatTime(notification.timestamp)}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
