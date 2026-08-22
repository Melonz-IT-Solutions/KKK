'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Activity, User } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { useDashboardActivityLogs } from '@/modules/dashboard/hooks/use-dashboard-activity-logs'

export function ActivityLogs() {
  const router = useRouter()

  const { activities, loading } = useDashboardActivityLogs()

  const recentActivities = activities.slice(0, 4)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-foreground text-base font-semibold">Activity Logs</h3>

        <p className="text-muted-foreground text-sm">{activities.length} activities for today</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Loading */}
        {loading && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            Loading activities...
          </div>
        )}

        {!loading && recentActivities.length > 0 && (
          <div className="flex flex-col gap-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="bg-muted h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {activity.type === 'STAFF' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {activity.actorName}
                    </p>

                    <p className="text-muted-foreground truncate text-sm">
                      {activity.description}
                      {activity.subjectName && (
                        <span className="text-foreground ml-1 font-medium">
                          {activity.subjectName}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {activity.memberId && (
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-foreground h-auto shrink-0 p-0 text-sm"
                    onClick={() => router.push(`/members/${activity.memberId}`)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && recentActivities.length === 0 && (
          <div className="text-muted-foreground py-6 text-center text-sm">
            No activities for today.
          </div>
        )}

        {/* View All */}
        <div className="flex justify-center">
          <Button
            asChild
            variant="link"
            className="text-muted-foreground hover:text-foreground h-auto p-0 text-sm"
          >
            <Link href="/activity-log">View All</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
