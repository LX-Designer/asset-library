const SESSION_KEY = 'lp_session_id'

/**
 * Returns a persistent anonymous session ID stored in localStorage.
 * Replace with supabase.auth.getUser() when auth is added.
 */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}
