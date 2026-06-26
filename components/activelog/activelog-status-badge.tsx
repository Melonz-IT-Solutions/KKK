import { Badge } from '@/components/ui/badge';

interface Props {
  status: 'Success' | 'Failed' | 'Pending';
}

export default function ActiveLogStatusBadge({ status }: Props) {
  if (status === 'Failed') {
    return <Badge variant="destructive">{status}</Badge>;
  }

  if (status === 'Success') {
    return <Badge className="bg-green-500! text-white!">{status}</Badge>;
  }

  return <Badge variant="secondary">{status}</Badge>;
}
