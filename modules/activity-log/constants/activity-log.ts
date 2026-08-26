import { ActivityType } from '@/types/activelog'

export const TYPE_BADGE_VARIANT: Record<ActivityType, string> = {
  created: 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800',

  updated: 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800',

  imported: 'bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800',
}

export const ACTIVITY_LOG_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'activity', label: 'Activity' },
  { key: 'subject', label: 'Member / Staff' },
  { key: 'description', label: 'Description' },
  { key: 'actor', label: 'Performed by' },
] as const
