import { useCallback, useEffect, useState } from 'react'

export type Route = '/' | '/admin' | '/admin/login'

function parseRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/admin/login') return '/admin/login'
  if (path === '/admin') return '/admin'
  return '/'
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseRoute)

  useEffect(() => {
    const onPop = () => setRoute(parseRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: Route) => {
    const path = to === '/' ? '/' : to
    window.history.pushState({}, '', path)
    setRoute(to)
  }, [])

  return { route, navigate }
}
