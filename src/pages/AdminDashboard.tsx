import { useState } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSportAdmin } from '../hooks/useSportAdmin'
import { TeamsSection } from '../components/admin/TeamsSection'
import { LiveMatchSection } from '../components/admin/LiveMatchSection'
import { UpcomingSection } from '../components/admin/UpcomingSection'
import { TopScorersSection } from '../components/admin/TopScorersSection'
import { SeasonStatsSection } from '../components/admin/SeasonStatsSection'
import { VideoUploadSection } from '../components/admin/VideoUploadSection'
import { ImageUploadSection } from '../components/admin/ImageUploadSection'
import { SPORT_OPTIONS } from '../types/sportAdmin'
import type { Sport } from '../types'
import type { Route } from '../hooks/useRouter'

type AdminTab = 'teams' | 'live' | 'upcoming' | 'scorers' | 'stats' | 'videos' | 'images'

interface AdminDashboardProps {
  onNavigate: (route: Route) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { logout, admin } = useAuth()
  const [sport, setSport] = useState<Sport | ''>('')
  const [tab, setTab] = useState<AdminTab>('teams')
  const { data, loading, saving, error, save } = useSportAdmin(sport)

  const handleLogout = () => {
    logout()
    onNavigate('/admin/login')
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'teams', label: 'Teams & Players' },
    { id: 'live', label: 'Live Match' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'scorers', label: 'Top Scorers' },
    { id: 'stats', label: 'Season Stats' },
    { id: 'videos', label: 'Video Highlights' },
    { id: 'images', label: 'Match Images' },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <header className="glass border-b border-slate-700/50 px-4 py-3 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-bold text-lg">Admin Control</h1>
          {admin && (
            <p className="text-xs text-slate-500">
              {admin.fullName} · {admin.state}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="sr-only">Select sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport | '')}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-sm min-w-[180px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="">— Select game —</option>
            {SPORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 pointer-events-none" />
        </div>

        {saving && <span className="text-xs text-amber-400 animate-pulse">Saving…</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Public Site
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-500/15 text-red-400 border border-red-500/30"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {!sport ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="text-2xl font-bold text-slate-300 mb-2">Select a game first</p>
            <p className="text-slate-500 text-sm">
              Choose Cricket, Kabaddi, Football, or Basketball from the dropdown above.
              You can only manage one sport at a time.
            </p>
          </div>
        </div>
      ) : (
        <>
          <nav className="flex gap-1 px-4 py-2 border-b border-slate-700/50 overflow-x-auto scrollbar-thin">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto w-full">
            {loading ? (
              <p className="text-slate-500 text-center py-12">Loading {sport} data…</p>
            ) : (
              <>
                {tab === 'teams' && <TeamsSection sport={sport} data={data} onSave={save} />}
                {tab === 'live' && <LiveMatchSection sport={sport} data={data} onSave={save} />}
                {tab === 'upcoming' && <UpcomingSection data={data} onSave={save} />}
                {tab === 'scorers' && <TopScorersSection data={data} onSave={save} />}
                {tab === 'stats' && <SeasonStatsSection sport={sport} data={data} onSave={save} />}
                {tab === 'videos' && <VideoUploadSection sport={sport} onSave={save} />}
                {tab === 'images' && <ImageUploadSection sport={sport} onSave={save} />}
              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}
