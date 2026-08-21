'use client'

import Button from '@/components/button'
import { Save } from 'lucide-react'

import InfoField from '../account/info-field'

import type { PasswordInfo } from '@/modules/settings/types/settings'

interface PasswordSectionProps {
  passwordInfo: PasswordInfo
  updateField: (field: keyof PasswordInfo, value: string) => void
  onSubmit: () => void
  saving: boolean
}

export default function PasswordSection({
  passwordInfo,
  updateField,
  onSubmit,
  saving,
}: PasswordSectionProps) {
  return (
    <div className="w-full">
      <section className="grid gap-8 p-6">
        <InfoField
          label="Current Password"
          type="password"
          placeholder="**********"
          value={passwordInfo.currentPassword}
          onChange={value => updateField('currentPassword', value)}
        />

        <InfoField
          label="New Password"
          type="password"
          placeholder="**********"
          value={passwordInfo.newPassword}
          onChange={value => updateField('newPassword', value)}
        />

        <InfoField
          label="Confirm New Password"
          type="password"
          placeholder="**********"
          value={passwordInfo.confirmPassword}
          onChange={value => updateField('confirmPassword', value)}
        />

        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={saving}>
            <Save />

            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </section>
    </div>
  )
}
