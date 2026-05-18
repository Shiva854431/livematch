import { Home, Radio, Trophy, Calendar, Star, Settings, Play } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', active: false },
  { icon: Radio, label: 'Live Now', active: true },
  { icon: Trophy, label: 'Leagues', active: false },
  { icon: Calendar, label: 'Schedule', active: false },
  { icon: Star, label: 'Favorites', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

interface LeftSidebarProps {
  onAdminClick?: () => void
}

export function LeftSidebar({ onAdminClick }: LeftSidebarProps) {
  return (
    <aside className="hidden lg:flex w-[72px] xl:w-60 flex-col glass border-r border-white/[0.06] shrink-0 z-30">
      <div className="p-4 xl:p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
          <div className="hidden xl:block">
            <h1 className="font-display text-xl font-bold tracking-wide">STRIDER</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">Live</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-400 border-l-2 border-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
            <span className="hidden xl:inline">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.06] hidden xl:block">
        <div className="rounded-2xl p-4 border border-white/[0.08] bg-gradient-to-br from-slate-800/80 to-slate-900/80 relative overflow-hidden">
          <div className="absolute inset-0 mesh-grid opacity-50" />
          <p className="relative text-xs text-slate-500">Unlock 4K streams</p>
          <p className="relative text-sm font-bold text-gradient-brand mt-0.5">Strider Pro</p>
          {onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              className="relative mt-3 w-full py-2 text-xs font-semibold rounded-xl bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10 transition-colors"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
