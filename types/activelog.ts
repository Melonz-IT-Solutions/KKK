export interface ActiveLog {
  avatar?: string | Blob | undefined
  id: string

  name: string

  role: 'Member' | 'Staff' | 'Manager'

  action:
    | 'New Manager Created'
    | 'Budget Approved'
    | 'Updated Profile'
    | 'Member Login'
    | 'Member Logout'
    | 'Department Updated'
    | 'Member Removed'

  status: 'Success' | 'Failed' | 'Pending'

  timestamp: string

  minutesOnline: number

  description: string
}

// -----------------------------------------------------------------------------
// Activity Logs
// -----------------------------------------------------------------------------

export type ActivityType = 'created' | 'updated' | 'imported'

export interface ActivityLogEntry {
  id: string

  type: ActivityType

  title: string

  description: string

  subjectName?: string

  actorName: string

  actionLabel: 'Created by' | 'Updated by'

  /**
   * Formatted database createdAt date.
   *
   * Example:
   * August 10, 2026
   */
  date: string
}

export type ActivityViewMode = 'timeline' | 'table'
