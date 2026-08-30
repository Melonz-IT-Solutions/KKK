'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { UserRoundCheck, UserRoundX, Users } from 'lucide-react'

interface DashboardCard {
  label: string
  value: string
  icon: string
  href: string
}

export default function DataTableCards() {
  const [reports, setReports] = useState<DashboardCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setReports(data.cards ?? [])
      setLoading(false)
    }
    void load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-xs">
            <CardHeader>
              <div className="flex items-start justify-between p-2">
                <div className="flex flex-col items-start justify-center gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {reports.map(report => {
        const iconMap: Record<string, React.ElementType> = {
          Users,
          UserRoundCheck,
          UserRoundX,
        }
        const Icon = iconMap[report.icon] ?? Users

        return (
          <Link key={report.label} href={report.href}>
            <Card className="hover:bg-muted/50 cursor-pointer bg-white transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between p-2">
                  <div className="rounded-lg">
                    <div className="flex flex-col items-start justify-center gap-3">
                      <CardDescription>{report.label}</CardDescription>
                      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {report.value}
                      </CardTitle>
                    </div>
                  </div>
                  <div>
                    <Icon />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
