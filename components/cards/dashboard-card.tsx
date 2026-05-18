import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const reports = [
  {
    label: 'Total Revenue',
    value: '$1,250.00',
    trend: '+12.5%',
    footerTitle: 'Trending up this month',
    footerSub: 'Visitors for the last 6 months',
  },
  {
    label: 'New Customers',
    value: '1,234',
    trend: '-20%',
    footerTitle: 'Down 20% this period',
    footerSub: 'Acquisition needs attention',
  },
  {
    label: 'Active Accounts',
    value: '45,678',
    trend: '+12.5%',
    footerTitle: 'Strong user retention',
    footerSub: 'Engagement exceed targets',
  },
  {
    label: 'Growth Rate',
    value: '4.5%',
    trend: '+4.5%',
    footerTitle: null,
    footerSub: null,
  },
]

export default function DashboardCard() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {reports.map(report => (
        <Card key={report.label} className="@container/card">
          <CardHeader>
            <CardDescription>{report.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {report.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-4" />
                {report.trend}
              </Badge>
            </CardAction>
          </CardHeader>
          {(report.footerTitle || report.footerSub) && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              {report.footerTitle && (
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {report.footerTitle} <TrendingUp className="size-4" />
                </div>
              )}
              {report.footerSub && <div className="text-muted-foreground">{report.footerSub}</div>}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
