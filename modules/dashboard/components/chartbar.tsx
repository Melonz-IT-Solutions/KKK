'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

import type { MonthlyMemberData } from '@/modules/dashboard/types/chart'

export const description = 'Members overview bar chart'

const chartConfig = {
  members: {
    label: 'Members',
  },
} satisfies ChartConfig

interface ChartBarProps {
  data: MonthlyMemberData[]
}

export function ChartBar({ data }: ChartBarProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Members Overview</CardTitle>

        <Users className="text-muted-foreground h-5 w-5" />
      </CardHeader>

      <CardContent className="w-full">
        <div className="h-67 w-full min-w-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} className="stroke-muted" />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="fill-muted-foreground text-xs"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
                domain={[0, 'auto']}
                className="fill-muted-foreground text-xs"
              />

              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

              <Bar
                dataKey="members"
                radius={[4, 4, 0, 0]}
                className="fill-primary dark:fill-white"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
