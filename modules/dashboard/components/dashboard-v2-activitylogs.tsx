'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export function ActivityLogs() {
  const router = useRouter()
  const [recentMembers, setRecentMembers] = useState<
    { id: number; name: string; address: string }[]
  >([])

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setRecentMembers(data.recentMembers ?? [])
    }
    void load()
  }, [])

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-foreground text-base font-semibold">Activity Logs</h3>
        <p className="text-muted-foreground text-sm">
          {recentMembers.length} new activities for today
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {recentMembers.map(member => (
          <div key={member.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="bg-muted h-9 w-9 shrink-0">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-medium">{member.name}</p>
                <p className="text-muted-foreground truncate text-sm">
                  Added a new member:{' '}
                  <span className="text-foreground font-medium">{member.name}</span>
                </p>
              </div>
            </div>

            <Button
              variant="link"
              className="text-muted-foreground hover:text-foreground h-auto shrink-0 p-0 text-sm"
              onClick={() => router.push(`/members/${member.id}`)}
            >
              View Details
            </Button>
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            asChild
            variant="link"
            className="text-muted-foreground hover:text-foreground mx-auto h-auto p-0 text-sm"
          >
            <Link href="/members">View All</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
