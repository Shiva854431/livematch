interface TeamLogoProps {
  abbr: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'h-10 w-10 text-xs',
  md: 'h-14 w-14 text-sm',
  lg: 'h-20 w-20 text-lg',
  xl: 'h-28 w-28 md:h-32 md:w-32 text-2xl md:text-3xl',
}

export function TeamLogo({ abbr, color, size = 'md' }: TeamLogoProps) {
  return (
    <div
      className={`${sizes[size]} rounded-2xl flex items-center justify-center font-display font-bold tracking-tight relative overflow-hidden ring-2 ring-white/10 shadow-2xl`}
      style={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}cc 45%, #0f172a 100%)`,
      }}
    >
      <span
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 50%)',
        }}
      />
      <span className="relative z-10 drop-shadow-lg">{abbr}</span>
    </div>
  )
}
