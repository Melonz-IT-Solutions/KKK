import { auth } from '@/auth'

export interface CurrentActor {
  id: number
  name: string
  role: string
}

export async function getCurrentActor(): Promise<CurrentActor | null> {
  const session = await auth()
  if (!session?.user) return null

  return {
    id: Number(session.user.id),
    name: session.user.name || 'System',
    role: session.user.role ?? 'STAFF',
  }
}

export async function getCurrentActorName(): Promise<string> {
  const actor = await getCurrentActor()
  return actor?.name ?? 'System'
}
