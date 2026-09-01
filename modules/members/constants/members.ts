import type { MemberColumn } from '@/modules/members/types/member'

// ---------------------------------------------------------------------------
// Member table
// ---------------------------------------------------------------------------

export const MEMBER_TABLE_COLUMNS: MemberColumn[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'membership',
    label: 'Membership',
  },
  {
    key: 'age',
    label: 'Age',
  },
  {
    key: 'branch',
    label: 'Branch',
  },
  {
    key: 'civilStatus',
    label: 'Civil Status',
  },
]


