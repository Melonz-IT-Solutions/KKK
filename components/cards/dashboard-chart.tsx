'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Users } from 'lucide-react'

const chartData = [
  { month: 'Jan', members: 20 },
  { month: 'Feb', members: 138 },
  { month: 'Mar', members: 90 },
  { month: 'Apr', members: 220 },
  { month: 'May', members: 368 },
  { month: 'Jun', members: 384 },
  { month: 'Jul', members: 120 },
  { month: 'Aug', members: 321 },
  { month: 'Sep', members: 415 },
  { month: 'Oct', members: 423 },
  { month: 'Nov', members: 438 },
  { month: 'Dec', members: 452 },
]

const chartConfig = {
  members: {
    label: 'Members',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export default function DashboardChart() {
  return (
    <div className="px-4 lg:px-2">
      <Card className="@container/card bg-white px-2 py-5">
        <CardHeader>
          <CardTitle className="flex justify-between text-2xl font-semibold @[250px]/card:text-2xl">
            Members Overview
            <Users />
          </CardTitle>
          {/* <CardDescription>January - December</CardDescription> */}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-75 w-full">
            <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
              <Bar dataKey="members" fill="var(--color-members)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
