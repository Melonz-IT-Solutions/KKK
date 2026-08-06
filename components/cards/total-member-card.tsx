import { totalMembers } from '@/lib/data/dashboardv2';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TotalMembersCard() {
  const Icon = totalMembers.icon;

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between '>
        <h3>{totalMembers.label}</h3>
        <Icon className='size-4' />
      </CardHeader>

      <CardContent>
        <div className='text-3xl font-bold  '>{totalMembers.value}</div>
        <div className='mt-6'>
          <Badge variant='outline'>{totalMembers.trend} vs last month</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
