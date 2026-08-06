import { UserRoundCheck, UserRoundX, Users } from 'lucide-react';

export const reports = [
  {
    label: 'Total Members',
    value: '45,223',
    icon: Users,
  },
  {
    label: 'Total Users',
    value: '35',
    icon: Users,
  },
  {
    label: 'Active Users',
    value: '13',
    trend: 'Active',
    icon: UserRoundCheck,
  },
  {
    label: 'Inactive Users',
    value: '3',
    icon: UserRoundX,
  },
];
