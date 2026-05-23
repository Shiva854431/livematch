import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Users } from 'lucide-react'

export interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: number
  isSystem?: boolean
}

interface LiveChatProps {
  matchId: string
  isOpen: boolean
  onClose: () => void
}

export function LiveChat({ matchId: _matchId, isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'System',
      message: 'Welcome to the live chat! Be respectful and enjoy the match.',
      timestamp: Date.now() - 60000,
      isSystem: true,
    },
  ])
  const [input, setInput] = useState('')
  const [onlineCount, setOnlineCount] = useState(142)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate random messages coming in
    const interval = setInterval(() => {
      if (!isOpen) return

      const randomMessages = [
        { username: 'CricketFan42', message: 'What a shot! 🔥' },
        { username: 'SportsLover', message: 'This match is intense!' },
        { username: 'TeamA_Supporter', message: 'Come on team A!' },
        { username: 'MatchWatcher', message: 'Amazing performance today' },
        { username: 'LiveSports', message: 'Can\'t believe that happened' },
      ]

      const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)]
      const newMessage: ChatMessage = {
        id: Date.now().toString() + Math.random(),
        username: randomMsg.username,
        message: randomMsg.message,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, newMessage].slice(-50))

      // Simulate online count fluctuation
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: input,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-4 bottom-4 w-96 h-[500px] glass-strong rounded-2xl border border-white/10 overflow-hidden z-50 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-400" />
          <h3 className="font-bold text-white">Live Chat</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Users className="h-4 w-4" />
            <span>{onlineCount}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.isSystem
                ? 'text-center text-xs text-slate-500 py-2'
                : msg.username === 'You'
                ? 'flex flex-col items-end'
                : 'flex flex-col items-start'
            }`}
          >
            {!msg.isSystem && (
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className={`text-xs font-medium ${
                    msg.username === 'You' ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {msg.username}
                </span>
                <span className="text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
              </div>
            )}
            <div
              className={`px-3 py-2 rounded-xl max-w-[85%] ${
                msg.isSystem
                  ? 'bg-transparent'
                  : msg.username === 'You'
                  ? 'bg-emerald-500/20 text-white'
                  : 'bg-white/5 text-slate-300'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
