import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { NotificationProvider } from './context/NotificationContext'
import { LanguageProvider } from './context/LanguageContext'
import { MatchProvider } from './context/MatchContext'
import { useRouter } from './hooks/useRouter'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminAuth } from './pages/AdminAuth'
import { PublicDashboard } from './pages/PublicDashboard'

function AppRoutes() {
  const { route, navigate } = useRouter()
  const { isAdmin } = useAuth()

  useEffect(() => {
    if (route === '/admin' && !isAdmin) {
      navigate('/admin/login')
    }
  }, [route, isAdmin, navigate])

  if (route === '/admin/login') {
    return <AdminAuth onNavigate={navigate} />
  }

  if (route === '/admin') {
    if (!isAdmin) return <AdminAuth onNavigate={navigate} />
    return <AdminDashboard onNavigate={navigate} />
  }

  return <PublicDashboard onNavigate={navigate} />
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NotificationProvider>
          <LanguageProvider>
            <MatchProvider>
              <AppRoutes />
            </MatchProvider>
          </LanguageProvider>
        </NotificationProvider>
      </UserProvider>
    </AuthProvider>
  )
}
