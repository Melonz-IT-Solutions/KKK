'use client';

import { reports } from '@/lib/data/datatable';
import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

export default function DataTableCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {reports.map((report) => {
        const Icon = report.icon;

        return (
          <Card key={report.label} className="@container/card">
            <CardHeader className="space-y-6">
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-3 ${report.iconBg}`}>
                  <Icon className={`h-5 w-5 ${report.iconColor}`} />
                </div>

                <CardAction>
                  <Badge
                    variant="outline"
                    className="border-none bg-transparent text-green-700 shadow-none">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {report.trend}
                  </Badge>
                </CardAction>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {report.label}
                </CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {report.value}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
