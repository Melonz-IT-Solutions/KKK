export interface MemberRow {
  id: number;
  name: string;
  membership: string;
  age: number;
  address: string;
  status: string;
}

export interface MemberColumn {
  key: string;
  label: string;
}

export interface MemberV2TableProps {
  data: MemberRow[];
}

export interface RowMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface BranchOption {
  label: string;
  value: string;
}
