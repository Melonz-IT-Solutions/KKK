// modules/activity-logs/components/activity-logs-timeline.tsx
'use client';

import { UserPlus, RotateCw, Users } from 'lucide-react';
import { ActivityLogEntry, ActivityType } from '@/types/activelog';

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  created: UserPlus,
  updated: RotateCw,
  imported: Users,
};

interface ActivityLogsTimelineProps {
  logs: ActivityLogEntry[];
}

export function ActivityLogsTimeline({ logs }: ActivityLogsTimelineProps) {
  return (
    <div className='flex flex-col'>
      {logs.map((log, index) => {
        const Icon = ACTIVITY_ICONS[log.type];
        const isLast = index === logs.length - 1;

        return (
          <div key={log.id} className='flex gap-4'>
            {/* Date */}

            {/* Icon + connecting line */}
            <div className='flex flex-col items-center'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-800 text-white'>
                <Icon className='h-4 w-4' />
              </div>
              {!isLast && (
                <div
                  className='w-px flex-1 bg-border'
                  style={{ minHeight: 40 }}
                />
              )}
            </div>

            {/* Content */}
            <div className='pb-8 pt-1'>
              <p className='text-sm font-semibold text-foreground'>
                {log.title}
              </p>
              <p className='mt-0.5 text-sm text-muted-foreground'>
                {log.description}
              </p>
              <p className='mt-0.5 text-xs text-muted-foreground'>
                {log.actionLabel}:{' '}
                <span className='text-primary'>{log.actorName}</span>
              </p>
            </div>
            <div className='w-24 shrink-0 pt-2 text-right text-xs text-muted-foreground'>
              {log.date}
            </div>
          </div>
        );
      })}
    </div>
  );
}
