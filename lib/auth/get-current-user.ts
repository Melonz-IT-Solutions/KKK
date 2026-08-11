// lib/auth/get-current-actor.ts
import { auth } from '@/auth'

// Real logged-in user's name, for activity log actorName fields. Falls back
// to "System" when there's no session (e.g. a script running outside a
// request context) instead of silently hardcoding a role name.
export async function getCurrentActorName(): Promise<string> {
  const session = await auth()
  return session?.user?.name || 'System'
}
