import { useState, useEffect } from 'react'

export function useIsDesktop(breakpoint = 900) {
  const [ok, setOk] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= breakpoint
  )
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const handler = (e) => setOk(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return ok
}
