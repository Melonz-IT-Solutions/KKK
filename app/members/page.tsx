import { auth } from '@/auth'
import MemberV2Page from '@/modules/members'

export default async function MembersPage() {
  const session = await auth()

  const userRole = session?.user?.role ?? 'STAFF'

  return <MemberV2Page userRole={userRole} />
}
