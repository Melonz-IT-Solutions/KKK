import { ActiveLog } from '@/types/activelog';

export const activeLogs: ActiveLog[] = [
  {
    id: '1',
    name: 'John Doe',
    action: 'Login',
    status: 'Success',
    timestamp: '2026-06-12 09:15 AM',
    minutesOnline: 12,
  },
  {
    id: '2',
    name: 'Jane Smith',
    action: 'Updated Profile',
    status: 'Pending',
    timestamp: '2026-06-12 09:22 AM',
    minutesOnline: 50,
  },
  {
    id: '3',
    name: 'Admin User',
    action: 'Deleted Department',
    status: 'Failed',
    timestamp: '2026-06-12 10:01 AM',
    minutesOnline: 50,
  },
];
