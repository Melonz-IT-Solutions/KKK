export interface MemberRow {
  id: number
  fullName: string
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  membership: string
  age: number
  branch: string
  address: string
  civilStatus: string | null
}

export interface MemberColumn {
  key: string
  label: string
}

export interface MemberV2TableProps {
  data: MemberRow[]
}

export interface RowMenuProps {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export interface BranchOption {
  label: string
  value: string
}
