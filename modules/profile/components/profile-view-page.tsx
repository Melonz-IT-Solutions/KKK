// modules/profile/components/profile-view-page.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/button-v2/button'
import Input from '@/components/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS, type CurrentUser } from '@/lib/data/current-user'
import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

interface ProfileViewPageProps {
  user: CurrentUser
  managerName?: string | null
}

interface ProfileFormValues {
  name: string
  contactNo: string
}

export default function ProfileViewPage({ user, managerName }: ProfileViewPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<ProfileFormValues>({
    name: user.name,
    contactNo: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/staff/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      showSuccessToast('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Profile</h1>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 rounded-md border p-6">
        {/* Role + Organization level — always read-only, not user-editable */}
        <div className="flex flex-wrap gap-6 border-b pb-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Role</p>
            <Badge variant="outline" className="mt-1 rounded-md font-normal">
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Department
            </p>
            <p className="mt-1 text-sm text-slate-700">{user.department}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Branch</p>
            <p className="mt-1 text-sm text-slate-700">{user.branch ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Reports to
            </p>
            <p className="mt-1 text-sm text-slate-700">{managerName ?? '—'}</p>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-slate-700">{user.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contactNo">Contact Number</Label>
            {isEditing ? (
              <Input
                id="contactNo"
                value={form.contactNo}
                onChange={e => setForm(prev => ({ ...prev, contactNo: e.target.value }))}
              />
            ) : (
              <p className="text-sm text-slate-700">{form.contactNo || '—'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 border-t pt-4">
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
