// modules/activity-logs/components/activity-logs-table.tsx
'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ActivityLogEntry, ActivityType } from '@/types/activelog'

const TYPE_BADGE_VARIANT: Record<ActivityType, string> = {
  created: 'bg-green-100 text-green-800',
  updated: 'bg-blue-100 text-blue-800',
  imported: 'bg-purple-100 text-purple-800',
}

interface ActivityLogsTableProps {
  logs: ActivityLogEntry[]
}

export function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  return (
    <div className="w-full overflow-x-auto border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Create by</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map(log => (
            <TableRow key={log.id}>
              <TableCell>
                <Badge
                  className={`rounded-sm ${TYPE_BADGE_VARIANT[log.type]} hover:${TYPE_BADGE_VARIANT[log.type]}`}
                >
                  {log.title}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{log.description}</TableCell>

              <TableCell className="text-foreground text-sm font-medium">{log.actorName}</TableCell>
              <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                {log.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
