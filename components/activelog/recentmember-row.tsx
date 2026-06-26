import { ActiveLog } from '@/types/activelog';

import { TableCell, TableRow } from '@/components/ui/table';

import ActiveLogStatusBadge from './activelog-status-badge';

interface Props {
  log: ActiveLog;
}

export default function ActiveLogRow({ log }: Props) {
  return (
    <TableRow>
      <TableCell className="font-medium">{log.name}</TableCell>

      <TableCell>{log.action}</TableCell>

      <TableCell>
        <ActiveLogStatusBadge status={log.status} />
      </TableCell>

      <TableCell>{log.minutesOnline} mins ago</TableCell>
    </TableRow>
  );
}
