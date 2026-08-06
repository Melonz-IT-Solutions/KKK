'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import { membersChartData } from '@/modules/dashboard/constants/dashboard-chartbar';

export const description = 'Members overview bar chart';

const chartConfig = {
  members: {
    label: 'Members',
  },
} satisfies ChartConfig;

export function ChartBar() {
  return (
    <Card className='w-full  '>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-base font-semibold'>
          Members Overview
        </CardTitle>
        <Users className='h-5 w-5 text-muted-foreground' />
      </CardHeader>
      <CardContent className='w-full'>
        {/* Fixed-size wrapper guarantees a non-zero width/height
            for Recharts' ResponsiveContainer, regardless of parent layout */}
        <div className='h-67 w-full min-w-0'>
          <ChartContainer config={chartConfig} className='h-full w-full'>
            <BarChart accessibilityLayer data={membersChartData}>
              <CartesianGrid vertical={false} className='stroke-muted' />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className='fill-muted-foreground text-xs'
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                ticks={[0, 15, 30, 45, 60]}
                domain={[0, 60]}
                className='fill-muted-foreground text-xs'
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey='members'
                radius={[4, 4, 0, 0]}
                className='fill-primary dark:fill-white'
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
