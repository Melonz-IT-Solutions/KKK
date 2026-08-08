import Button from '@/components/button'
import { Save } from 'lucide-react'

import InfoField from './info-field'
import type { PasswordSectionProps } from '@/types/accountfield'

export default function PasswordSection({
  passwordInfo,
  updateField,
  onSubmit,
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
          <Button onClick={onSubmit}>
            <Save />
            Save Changes
          </Button>
        </div>
      </section>
    </div>
  )
}
