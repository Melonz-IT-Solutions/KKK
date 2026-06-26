'use client'

import { Plus, X } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  roles: string[]
  addRole: (role: string) => void
  removeRole: (role: string) => void
}

const AVAILABLE_ROLES = ['SUPER_ADMIN', 'SYSTEM_MANAGER', 'ADMIN', 'EDITOR', 'VIEWER']

export default function RoleBadges({ roles, addRole, removeRole }: Props) {
  const availableRoles = AVAILABLE_ROLES.filter(role => !roles.includes(role))

  return (
    <div className="space-y-3 p-3">
      <h3 className="font-medium">Assigned Roles</h3>

      <div className="flex flex-wrap items-start gap-2 rounded border p-2">
        {roles.map(role => (
          <span
            key={role}
            className="bg-muted flex items-center gap-2 rounded border px-3 py-1 text-sm text-green-600"
          >
            {role}

            <button
              type="button"
              onClick={() => removeRole(role)}
              className="text-red-500 hover:text-red-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={availableRoles.length === 0}
              className="flex items-center gap-2 rounded border bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} />
              Add Role
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-52">
            {availableRoles.length > 0 ? (
              availableRoles.map(role => (
                <DropdownMenuItem key={role} onClick={() => addRole(role)}>
                  {role}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No roles available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
