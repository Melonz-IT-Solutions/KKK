export type DepartmentId = 'finance' | 'mis' | 'branch-manager';

export type DepartmentName = 'Finance' | 'MIS' | 'Branch Manager';

export type Department = DepartmentName;

export interface DepartmentItem {
  id: DepartmentId;
  name: DepartmentName;
  description: string;
}

export const DEPARTMENTS = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial planning, accounting, and reporting',
  },
  {
    id: 'mis',
    name: 'MIS',
    description: 'Management information systems and data reporting',
  },
  {
    id: 'branch-manager',
    name: 'Branch Manager',
    description: 'Branch-level operations and management',
  },
] as const satisfies readonly DepartmentItem[];

export const getDepartmentById = (id: string): DepartmentItem | undefined => {
  return DEPARTMENTS.find((dept) => dept.id === id);
};

export const getDepartmentName = (id: string): DepartmentName | undefined => {
  return getDepartmentById(id)?.name;
};

export const DEPARTMENT_IDS = DEPARTMENTS.map((dept) => dept.id);
export const DEPARTMENT_NAMES = DEPARTMENTS.map((dept) => dept.name);

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  label: dept.name,
  value: dept.id,
}));
