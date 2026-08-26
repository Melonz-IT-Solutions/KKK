import { notFound } from 'next/navigation'
import { getMemberProfile } from '@/lib/services/member-service'
import MemberProfilePage from '@/modules/members/components/profile/profile-view-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const profile = await getMemberProfile(Number(id))

  if (!profile) {
    notFound()
  }

  return (
    <div>
      <MemberProfilePage profile={profile} />
    </div>
  )
}
