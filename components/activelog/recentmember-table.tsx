import { ActiveLog } from '@/types/activelog'

import ActiveLogColumns from '@/components/activelog/activelog-columns'
import ActiveLogHeader from './activelog-header'
import ActiveLogRow from '@/components/activelog/recentmember-row'

import { Table, TableBody } from '@/components/ui/table'

interface Props {
  data: ActiveLog[]
}

export default function ActiveLogTable({ data }: Props) {
  const successLogs = data.filter(log => log.status === 'Success')

  return (
    <div className="bg-card w-full rounded-xl border">
      <ActiveLogHeader title="Recent Activity Log" description="" buttonText="View All Logs" />

      <Table>
        <ActiveLogColumns />

        <TableBody>
          {successLogs.map(log => (
            <ActiveLogRow key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
