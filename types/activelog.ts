export interface ActiveLog {
  avatar?: string | Blob | undefined;
  id: string;

  name: string;
  role: 'Member' | 'Staff' | 'Manager';

  action:
    | 'New Manager Created'
    | 'Budget Approved'
    | 'Updated Profile'
    | 'Member Login'
    | 'Member Logout'
    | 'Department Updated'
    | 'Member Removed';

  status: 'Success' | 'Failed' | 'Pending';

  timestamp: string;
  minutesOnline: number;

  description: string;
}

// modules/activity-logs/types/activity-log.ts
export type ActivityType = 'created' | 'updated' | 'imported';

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  actorName: string;
  actionLabel: 'Created by' | 'Updated by';
  date: string;
}

export type ActivityViewMode = 'timeline' | 'table';
