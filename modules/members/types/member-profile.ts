import type { getMemberProfile } from '@/lib/services/member-service'

export type MemberProfile = NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>
