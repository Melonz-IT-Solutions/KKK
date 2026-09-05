export type DepartmentId =
  | 'FINANCE'
  | 'MIS'
  | 'CLUSTER_MANAGER'
  | 'BRANCH_MANAGER'
  | 'FDO'
  | 'OPERATIONS'
  | 'ADMIN_AND_HR'
  | 'ACCOUNTING'
  | 'AUDIT_DEPARTMENT'
  | 'GUEST'

export type DepartmentName =
  | 'Finance'
  | 'MIS'
  | 'Cluster Manager'
  | 'Branch Manager'
  | 'FDO'
  | 'Operations'
  | 'Admin and HR'
  | 'Accounting'
  | 'Audit Department'
  | 'Guest'

export type Department = DepartmentName

export interface DepartmentItem {
  id: DepartmentId
  name: DepartmentName
  description: string
}

export const DEPARTMENTS = [
  {
    id: 'FINANCE',
    name: 'Finance',
    description: 'Financial planning, accounting, and reporting',
  },
  {
    id: 'MIS',
    name: 'MIS',
    description: 'Management information systems and data reporting',
  },
  {
    id: 'CLUSTER_MANAGER',
    name: 'Cluster Manager',
    description: 'Oversight of multiple branches within a cluster',
  },
  {
    id: 'BRANCH_MANAGER',
    name: 'Branch Manager',
    description: 'Branch-level operations and management',
  },
  {
    id: 'FDO',
    name: 'FDO',
    description: 'Field development and outreach operations',
  },
  {
    id: 'OPERATIONS',
    name: 'Operations',
    description: 'Day-to-day operational support and coordination',
  },
  {
    id: 'ADMIN_AND_HR',
    name: 'Admin and HR',
    description: 'Administrative and human resources management',
  },
  {
    id: 'ACCOUNTING',
    name: 'Accounting',
    description: 'Bookkeeping, transactions, and financial records',
  },
  {
    id: 'AUDIT_DEPARTMENT',
    name: 'Audit Department',
    description: 'Internal audit and compliance review',
  },
  {
    id: 'GUEST',
    name: 'Guest',
    description: 'Limited, read-only access for guest users',
  },
] as const satisfies readonly DepartmentItem[]

export const getDepartmentById = (id: string): DepartmentItem | undefined => {
  return DEPARTMENTS.find(dept => dept.id === id)
}

export const getDepartmentName = (id: string): DepartmentName | undefined => {
  return getDepartmentById(id)?.name
}

export const DEPARTMENT_IDS = DEPARTMENTS.map(dept => dept.id)
export const DEPARTMENT_NAMES = DEPARTMENTS.map(dept => dept.name)

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(dept => ({
  label: dept.name,
  value: dept.id,
}))
