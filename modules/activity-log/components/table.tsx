import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

import type { ActivityLogEntry } from '@/types/activelog'

import {
  TYPE_BADGE_VARIANT,
  ACTIVITY_LOG_COLUMNS,
} from '@/modules/activity-log/constants/activity-log'

interface ActivityLogsTableProps {
  logs: ActivityLogEntry[]
}

export function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {ACTIVITY_LOG_COLUMNS.map(column => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {logs.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={ACTIVITY_LOG_COLUMNS.length}
              className="py-10 text-center text-sm text-slate-400"
            >
              No results found.
            </TableCell>
          </TableRow>
        )}

        {logs.map(log => (
          <TableRow key={log.id}>
            <TableCell>{log.date}</TableCell>

            <TableCell>
              <Badge className={`rounded-sm ${TYPE_BADGE_VARIANT[log.type]}`}>{log.title}</Badge>
            </TableCell>

            <TableCell>{log.subjectName}</TableCell>

            <TableCell>{log.description}</TableCell>

            <TableCell>{log.actorName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
