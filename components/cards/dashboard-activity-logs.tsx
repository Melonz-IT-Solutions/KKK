import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const activities = [
  {
    initials: 'OM',
    name: 'Olivia Martin',
    description: 'Added a new member: John Doe',
  },
  {
    initials: 'JL',
    name: 'Jackson Lee',
    description: 'Updated member profile: Jane Smith',
  },
  {
    initials: 'IN',
    name: 'Isabella Nguyen',
    description: 'Removed a member: Mark Wilson',
  },
  {
    initials: 'WK',
    name: 'William Kim',
    description: 'Added a new staff account: Sarah Connor',
  },
]

export default function DashboardActivityLogs() {
  return (
    <div className="px-4 lg:px-2">
      <Card className="@container/card bg-white px-2 py-5">
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl font-semibold @[250px]/card:text-2xl">
            Activity Logs
          </CardTitle>
          <CardDescription>4 new activities for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {activities.map(activity => (
              <div key={activity.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>{activity.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-5">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-muted-foreground text-sm">{activity.description}</p>
                  </div>
                </div>
                <Link href="/activity-logs" className="shrink-0 text-sm underline">
                  View Details
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/activity-logs" className="text-sm underline">
              View All
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
