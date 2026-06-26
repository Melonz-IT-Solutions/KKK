import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

const columns = ['Name', 'Action', 'Status', 'Timestamp'];

export default function ActiveLogColumns() {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column}>{column}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
