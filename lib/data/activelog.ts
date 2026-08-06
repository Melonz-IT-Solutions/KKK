import { ActiveLog } from '@/types/activelog';

export const activeLogs: ActiveLog[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'Manager',
    action: 'New Manager Created',
    description: "Created 'Branch Manager North'",
    status: 'Success',
    timestamp: '2 HOURS AGO',
    minutesOnline: 12,
  },

  {
    id: '2',
    name: 'Finance Admin',
    role: 'Staff',
    action: 'Budget Approved',
    description: 'Finance module budget for Q3 finalized',
    status: 'Success',
    timestamp: '5 HOURS AGO',
    minutesOnline: 50,
  },

  {
    id: '3',
    name: 'Jane Smith',
    role: 'Member',
    action: 'Updated Profile',
    description: 'Updated profile information',
    status: 'Pending',
    timestamp: '10 HOURS AGO',
    minutesOnline: 15,
  },

  {
    id: '4',
    name: 'John Doe',
    role: 'Staff',
    action: 'Department Updated',
    description: 'Modified Finance Department settings',
    status: 'Success',
    timestamp: '1 DAY AGO',
    minutesOnline: 8,
  },

  {
    id: '5',
    name: 'Maria Santos',
    role: 'Manager',
    action: 'Member Removed',
    description: 'Removed inactive member account',
    status: 'Failed',
    timestamp: '1 DAY AGO',
    minutesOnline: 5,
  },

  {
    id: '6',
    name: 'Peter Brown',
    role: 'Member',
    action: 'Member Login',
    description: 'Logged into the system',
    status: 'Success',
    timestamp: '2 DAYS AGO',
    minutesOnline: 45,
  },
];
