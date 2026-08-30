'use client'

import { useEffect, useState } from 'react'

import { Check } from 'lucide-react'

import Button from '@/components/button'
import { Checkbox } from '@/components/ui/checkbox'

import { showErrorToast, showSuccessToast } from '@/lib/toast-messagealert/showSuccessToast'

interface RoleData {
  name: string
  label: string
  permissions: string[]
}

interface PermissionData {
  name: string
  label: string
  category: string
}

interface ApiResponse {
  roles: RoleData[]
  allPermissions: PermissionData[]
}

export default function RolesSection() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [localPermissions, setLocalPermissions] = useState<Record<string, string[]>>({})
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings/roles', { cache: 'no-store' })
      .then(async r => {
        const res = await r.json()
        if (!r.ok) throw new Error(res.message ?? 'Failed to load role permissions')
        if (!Array.isArray(res.roles) || !Array.isArray(res.allPermissions)) {
          throw new Error('Invalid response from server')
        }
        return res as ApiResponse
      })
      .then(res => {
        setData(res)
        const permsMap: Record<string, string[]> = {}
        for (const role of res.roles) {
          permsMap[role.name] = [...role.permissions]
        }
        setLocalPermissions(permsMap)
        if (res.roles.length > 0) setSelectedRole(res.roles[0].name)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const togglePermission = (permission: string) => {
    setLocalPermissions(prev => {
      const current = prev[selectedRole] ?? []
      const has = current.includes(permission)
      return {
        ...prev,
        [selectedRole]: has ? current.filter(p => p !== permission) : [...current, permission],
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          permissions: localPermissions[selectedRole] ?? [],
        }),
      })
      const res = await response.json()
      if (!response.ok) throw new Error(res.message)
      showSuccessToast(res.message)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to save permissions')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Loading permissions...</p>
      </div>
    )
  }

  if (!data || !data.allPermissions || !data.roles) return null

  const currentPermissions = localPermissions[selectedRole] ?? []

  // Group permissions by category
  const grouped = data.allPermissions.reduce<Record<string, PermissionData[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <div className="w-full">
      <section className="p-6">
        {/* Role tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {data.roles.map(role => (
            <button
              key={role.name}
              type="button"
              onClick={() => setSelectedRole(role.name)}
              className={`rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
                selectedRole === role.name
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Permission groups */}
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, perms]) => (
            <div key={category}>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                {category}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {perms.map(perm => (
                  <label
                    key={perm.name}
                    className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-sm border p-3 transition-colors"
                  >
                    <Checkbox
                      checked={currentPermissions.includes(perm.name)}
                      onCheckedChange={() => togglePermission(perm.name)}
                    />
                    <span className="text-sm">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Check className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Permissions'}
          </Button>
        </div>
      </section>
    </div>
  )
}
