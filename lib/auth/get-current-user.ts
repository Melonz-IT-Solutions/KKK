import { auth } from '@/auth'

export interface CurrentActor {
  id: number
  name: string
  role: string
  branch: string | null
}

export async function getCurrentActor(): Promise<CurrentActor | null> {
  const session = await auth()
  if (!session?.user) return null

  return {
    id: Number(session.user.id),
    name: session.user.name || '',
    role: session.user.role,
    branch: session.user.branch ?? null,
  }
}

export async function getCurrentActorName(): Promise<string> {
  const actor = await getCurrentActor()
  return actor?.name ?? 'System'
}
