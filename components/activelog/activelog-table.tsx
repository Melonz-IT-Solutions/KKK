import { ActiveLog } from '@/types/activelog';

import ActiveLogRow from '@/components/activelog/activelog-row';
import ActiveLogHeader from '@/components/activelog/activelog-header';
import ActiveLogColumns from '@/components/activelog/activelog-columns';

import { Table, TableBody } from '@/components/ui/table';

interface Props {
  data: ActiveLog[];
}

export default function ActiveLogTable({ data }: Props) {
  return (
    <div className="rounded-sm border">
      <ActiveLogHeader
        title="Active Logs"
        description="Recent system activity"
        buttonText="View All Logs"
      />

      <Table>
        <ActiveLogColumns />

        <TableBody>
          {data.map((log) => (
            <ActiveLogRow key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
