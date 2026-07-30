export const DEPARTMENTS = [
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial planning and accounting',
  },
  {
    id: 'mis',
    name: 'MIS',
    description: 'MIS Department',
  },
]

// Type utilities
export type Department = (typeof DEPARTMENTS)[number]
export type DepartmentId = Department['id']
export type DepartmentName = Department['name']

// Helper functions
export const getDepartmentById = (id: string): Department | undefined => {
  return DEPARTMENTS.find(dept => dept.id === id)
}

export const getDepartmentName = (id: string): string | undefined => {
  return getDepartmentById(id)?.name
}

export const DEPARTMENT_IDS = DEPARTMENTS.map(dept => dept.id)
export const DEPARTMENT_NAMES = DEPARTMENTS.map(dept => dept.name)

// For use in forms and selects
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(dept => ({
  label: dept.name,
  value: dept.id,
}))
