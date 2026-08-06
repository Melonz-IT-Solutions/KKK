'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { UserRoundCheck, UserRoundX, Users } from 'lucide-react';

export default function DataTableCards() {
  const [reports, setReports] = useState<
    { label: string; value: string; icon: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setReports(data.cards ?? []);
    };
    void load();
  }, []);

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      {reports.map((report) => {
        const iconMap: Record<string, React.ElementType> = {
          Users,
          UserRoundCheck,
          UserRoundX,
        };
        const Icon = iconMap[report.icon] ?? Users;

        return (
          <Card key={report.label}>
            <CardHeader>
              <div className='flex items-start justify-between p-2'>
                <div className='rounded-lg'>
                  <div className='flex flex-col gap-3 justify-center items-start'>
                    <CardDescription>{report.label}</CardDescription>
                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
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
        );
      })}
    </div>
  );
}
