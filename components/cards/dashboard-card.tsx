import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendingUp, Users, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'

const reports = [
  {
    label: 'Total Members',
    countValue: '45,231',
    icon: Users,
    linkUrl: '/members',
  },
  {
    label: 'Total Users',
    countValue: '1,234',
    icon: Users,
    linkUrl: '/staff',
  },
  {
    label: 'Active Users',
    countValue: '13',
    icon: UserCheck,
    linkUrl: '/staff?status=active',
  },
  {
    label: 'Inactive Users',
    countValue: '3',
    icon: UserX,
    linkUrl: '/staff?status=inactive',
  },
]

export default function DashboardCard() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {reports.map(report => {
        const Icon = report.icon
        return (
          <Link key={report.label} href={report.linkUrl}>
            <Card className="@container/card bg-white px-2 py-5">
              <CardHeader>
                <div className="flex justify-between">
                  <CardDescription className="text-md">{report.label}</CardDescription>
                  <Icon className="size-5 text-gray-500" />
                </div>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {report.countValue}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
