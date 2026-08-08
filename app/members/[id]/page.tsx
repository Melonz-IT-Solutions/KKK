// app/members/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getMemberProfile } from '@/lib/services/member-service'

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getMemberProfile(Number(id))

  if (!profile) notFound()

  const { principal, beneficiaries, dependents } = profile

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-4 md:p-6">
      {/* Principal */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Principal Member</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{principal.name}</dd>
          <dt className="text-muted-foreground">Address</dt>
          <dd>{principal.address}</dd>
          <dt className="text-muted-foreground">Age</dt>
          <dd>{principal.age}</dd>
          <dt className="text-muted-foreground">Membership</dt>
          <dd>{principal.membership}</dd>
          <dt className="text-muted-foreground">Civil Status</dt>
          <dd>{principal.civilStatus}</dd>
          <dt className="text-muted-foreground">Status</dt>
          <dd>{principal.status}</dd>
        </dl>
      </section>

      {/* Beneficiaries */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Beneficiaries</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['primary', 'secondary'] as const).map(role => {
            const b = beneficiaries[role]
            return (
              <div key={role} className="rounded-md border p-4">
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                  {role === 'primary' ? 'Primary' : 'Secondary'} Beneficiary
                </p>
                {b ? (
                  <dl className="grid gap-1 text-sm">
                    <div>
                      <dt className="text-muted-foreground inline">Name: </dt>
                      <dd className="inline">{b.name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground inline">Relationship: </dt>
                      <dd className="inline">{b.relationship}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground inline">Address: </dt>
                      <dd className="inline">{b.address}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-muted-foreground text-sm">Not provided</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Dependents */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Dependents ({dependents.length})</h2>
        {dependents.length === 0 ? (
          <p className="text-muted-foreground text-sm">No dependents on file.</p>
        ) : (
          <div className="grid gap-3">
            {dependents.map(d => (
              <div key={d.id} className="rounded-md border p-4 text-sm">
                <p className="font-medium">{d.name}</p>
                <p className="text-muted-foreground">
                  {d.gender} &middot; {d.address}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
