import type { Staff, StaffRole } from '@/types/accountfield'

export const staffMembers: Staff[] = [
  {
    id: '1',
    avatar: '/avatars/admin.png',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@kkk.com',
    contactNumber: '09123456789',
    department: 'Finance',
    role: 'SUPER_ADMIN',
    password: 'hashed-password',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    avatar: '/avatars/jane.png',
    firstName: 'Jane',
    lastName: 'Doe',
    fullName: 'Jane Doe',
    username: 'jane.doe',
    email: 'jane.doe@kmfi.com',
    contactNumber: '09123456780',
    department: 'MIS',
    role: 'FINANCE',
    password: 'hashed-password',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    avatar: '/avatars/marcus.png',
    firstName: 'Marcus',
    lastName: 'Miller',
    fullName: 'Marcus Miller',
    username: 'marcus.miller',
    email: 'm.miller@kmfi.com',
    contactNumber: '09123456781',
    department: 'Branch Manager',
    role: 'BRANCH_MANAGER',
    password: 'hashed-password',
    status: 'INACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    avatar: '/avatars/staff.png',
    firstName: 'Staff',
    lastName: 'User',
    fullName: 'Staff User',
    username: 'staff.user',
    email: 'staff.user@kmfi.com',
    contactNumber: '09123456782',
    department: 'MIS',
    role: 'STAFF_USER',
    password: 'hashed-password',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const getUserIdsByRole = (
  staffs: readonly Pick<Staff, 'id' | 'role'>[],
  role: StaffRole
): string[] => staffs.filter(staff => staff.role === role).map(staff => staff.id)

export const getSuperAdminUserIds = (staffs: readonly Pick<Staff, 'id' | 'role'>[]): string[] =>
  getUserIdsByRole(staffs, 'SUPER_ADMIN')

export const getFinanceUserIds = (staffs: readonly Pick<Staff, 'id' | 'role'>[]): string[] =>
  getUserIdsByRole(staffs, 'FINANCE')

export const getStaffUserIds = (staffs: readonly Pick<Staff, 'id' | 'role'>[]): string[] =>
  getUserIdsByRole(staffs, 'STAFF_USER')

export const getBranchManagerUserIds = (staffs: readonly Pick<Staff, 'id' | 'role'>[]): string[] =>
  getUserIdsByRole(staffs, 'BRANCH_MANAGER')

export const getStaffById = (staffs: readonly Staff[], id: string): Staff | undefined =>
  staffs.find(staff => staff.id === id)

export const isSuperAdminRole = (role: StaffRole): boolean => role === 'SUPER_ADMIN'

export const isFinanceRole = (role: StaffRole): boolean => role === 'FINANCE'

export const isStaffUserRole = (role: StaffRole): boolean => role === 'STAFF_USER'

export const isBranchManagerRole = (role: StaffRole): boolean => role === 'BRANCH_MANAGER'
