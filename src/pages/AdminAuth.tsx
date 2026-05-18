import { useState, type FormEvent, type ReactNode } from 'react'
import { Lock, Mail, Shield, User, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { Route } from '../hooks/useRouter'

type Mode = 'login' | 'register' | 'otp'
interface AdminAuthProps {
  onNavigate: (route: Route) => void
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi',
]

export function AdminAuth({ onNavigate }: AdminAuthProps) {
  const { login, registerSendOtp, registerVerify, hasAdmin, loading } = useAuth()
  const [mode, setMode] = useState<Mode>(hasAdmin === false ? 'register' : 'login')

  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [state, setState] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [devOtpHint, setDevOtpHint] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
      onNavigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setBusy(true)
    setDevOtpHint('')
    try {
      const result = await registerSendOtp({
        fullName,
        mobile,
        state,
        email,
        username,
        password,
        confirmPassword,
      })
      if (result.devOtp) {
        setDevOtpHint(result.devOtp)
        setOtp(result.devOtp)
      }
      setMode('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setBusy(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await registerVerify(username, otp)
      onNavigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-slate-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14] mesh-grid">
      <div className="w-full max-w-lg glass-strong rounded-3xl p-8 md:p-10 shadow-2xl border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold uppercase tracking-wide">Strider Admin</h1>
            <p className="text-sm text-slate-500">
              {hasAdmin === false ? 'First-time setup with email OTP' : 'Sign in or register'}
            </p>
          </div>
        </div>

        {hasAdmin !== false && mode !== 'otp' && (
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-slate-800/60">
            <TabBtn active={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>
              Sign In
            </TabBtn>
            <TabBtn active={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>
              Register
            </TabBtn>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-300">
              Default admin: <strong>admin</strong> / <strong>strider2026</strong>
            </div>
            <Field label="Username" value={username} onChange={setUsername} icon={User} />
            <Field label="Password" value={password} onChange={setPassword} type="password" icon={Lock} />
            {error && <Err msg={error} />}
            <Submit busy={busy} label="Sign In" />
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1">
            <Field label="Full Name" value={fullName} onChange={setFullName} icon={User} required />
            <Field label="Mobile Number" value={mobile} onChange={setMobile} icon={Phone} type="tel" required />
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-sm"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <Field label="Email (for OTP)" value={email} onChange={setEmail} icon={Mail} type="email" required />
            <Field label="Username" value={username} onChange={setUsername} icon={User} required />
            <Field label="Password" value={password} onChange={setPassword} type="password" icon={Lock} required />
            <Field
              label="Re-enter Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              icon={Lock}
              required
            />
            {error && <Err msg={error} />}
            <Submit busy={busy} label="Send OTP to Email" />
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {devOtpHint && (
              <div className="rounded-xl bg-amber-500/15 border border-amber-500/40 p-4 text-center">
                <p className="text-xs text-amber-300 uppercase font-bold mb-1">Your OTP (dev mode)</p>
                <p className="text-3xl font-black tracking-[0.4em] text-amber-400 tabular-nums">{devOtpHint}</p>
              </div>
            )}
            <p className="text-sm text-slate-400">
              {devOtpHint
                ? 'Enter the code above (email not sent — fix Gmail in .env for production)'
                : <>Enter the 6-digit code sent to <span className="text-emerald-400">{email}</span></>}
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 rounded-xl bg-slate-800 border border-slate-600 tabular-nums"
              placeholder="000000"
              required
            />
            {error && <Err msg={error} />}
            <Submit busy={busy} label="Verify & Create Account" />
            <button
              type="button"
              onClick={() => setMode('register')}
              className="w-full text-sm text-slate-500 hover:text-slate-300"
            >
              ← Back to registration
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="w-full mt-6 text-sm text-slate-500 hover:text-slate-300"
        >
          ← Back to live view
        </button>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
        active ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'
      }`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  icon: Icon,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  icon?: typeof User
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
        />
      </div>
    </div>
  )
}

function Err({ msg }: { msg: string }) {
  return <p className="text-sm text-red-400">{msg}</p>
}

function Submit({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
    >
      {busy ? 'Please wait…' : label}
    </button>
  )
}
