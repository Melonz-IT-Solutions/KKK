import { getRoleContext } from '@/lib/auth/effective-role'
import MemberV2Page from '@/modules/members'

export default async function MembersPage() {
  const { effectiveRole } = await getRoleContext()

  const userRole = effectiveRole ?? ''

  return <MemberV2Page userRole={userRole} />
}
