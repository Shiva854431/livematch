import { useState } from 'react'
import { X, Trophy, CheckCircle, XCircle, Clock, Users } from 'lucide-react'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  endTime: number
  userVoted: boolean
  userVote?: string
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
  points: number
}

interface PollsAndQuizzesProps {
  isOpen: boolean
  onClose: () => void
}

export function PollsAndQuizzes({ isOpen, onClose }: PollsAndQuizzesProps) {
  const [activeTab, setActiveTab] = useState<'polls' | 'quizzes'>('polls')
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)

  // Mock data - in production, this would come from the API
  const polls: Poll[] = [
    {
      id: '1',
      question: 'Who will win today\'s match?',
      options: [
        { id: 'a', text: 'Team A', votes: 450, percentage: 65 },
        { id: 'b', text: 'Team B', votes: 242, percentage: 35 },
      ],
      totalVotes: 692,
      isActive: true,
      endTime: Date.now() + 300000,
      userVoted: false,
    },
    {
      id: '2',
      question: 'Who will be the Man of the Match?',
      options: [
        { id: 'a', text: 'Player X', votes: 320, percentage: 40 },
        { id: 'b', text: 'Player Y', votes: 280, percentage: 35 },
        { id: 'c', text: 'Player Z', votes: 200, percentage: 25 },
      ],
      totalVotes: 800,
      isActive: true,
      endTime: Date.now() + 600000,
      userVoted: true,
      userVote: 'a',
    },
  ]

  const quizzes: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the highest individual score in IPL history?',
      options: ['175*', '264*', '158*', '200*'],
      correctAnswer: 1,
      timeLimit: 30,
      points: 100,
    },
    {
      id: '2',
      question: 'Which team has won the most IPL titles?',
      options: ['CSK', 'MI', 'KKR', 'RCB'],
      correctAnswer: 1,
      timeLimit: 20,
      points: 150,
    },
  ]

  const handleVote = (pollId: string, optionId: string) => {
    // In production, this would call an API
    console.log('Voted:', pollId, optionId)
  }

  const getTimeRemaining = (endTime: number) => {
    const remaining = endTime - Date.now()
    if (remaining <= 0) return 'Ended'
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-strong rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white">Polls & Quizzes</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-white/10 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('polls')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'polls'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Live Polls
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'quizzes'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Trivia Quiz
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {activeTab === 'polls' ? (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div key={poll.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-white">{poll.question}</h4>
                    {poll.isActive && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeRemaining(poll.endTime)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => !poll.userVoted && handleVote(poll.id, option.id)}
                        disabled={poll.userVoted}
                        className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                          poll.userVoted
                            ? option.id === poll.userVote
                              ? 'bg-emerald-500/20 border-emerald-500/30'
                              : 'bg-white/5 border-white/10'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
                        } ${poll.userVoted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {poll.userVoted && (
                          <div
                            className="absolute left-0 top-0 h-full bg-emerald-500/20 transition-all"
                            style={{ width: `${option.percentage}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between">
                          <span className="text-sm text-white">{option.text}</span>
                          <div className="flex items-center gap-2">
                            {poll.userVoted && option.id === poll.userVote && (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            )}
                            <span className="text-sm text-slate-400">{option.percentage}%</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Users className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold">
                        Q{idx + 1}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        +{quiz.points} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{quiz.timeLimit}s</span>
                    </div>
                  </div>

                  <h4 className="font-medium text-white mb-4">{quiz.question}</h4>

                  <div className="space-y-2">
                    {quiz.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all text-sm text-white"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center text-xs text-slate-400">
          Participate to earn points and win prizes!
        </div>
      </div>
    </div>
  )
}
