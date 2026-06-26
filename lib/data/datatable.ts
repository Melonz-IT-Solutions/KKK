import { Users, Wallet, FolderKanban, ShieldCheck } from 'lucide-react';

export const reports = [
  {
    label: 'TOTAL ADMINS',
    value: '24',
    trend: '+2 this week',
    icon: ShieldCheck,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  {
    label: 'TOTAL REVENUE',
    value: '$1,429,000',
    trend: '+12.4%',
    icon: Wallet,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  {
    label: 'ACTIVE PROJECTS',
    value: '158',
    trend: 'Active',
    icon: FolderKanban,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  {
    label: 'TOTAL MEMBERS',
    value: '8,642',
    trend: '+412 new',
    icon: Users,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
];
