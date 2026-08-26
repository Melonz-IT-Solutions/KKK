'use client'

import { Save } from 'lucide-react'

import Button from '@/components/button'
import InfoField from '@/modules/settings/components/info-field'

import { PASSWORD_FIELDS } from '@/modules/settings/data/settings'

import type { PasswordSectionProps } from '@/modules/settings/types/settings'

export default function PasswordSection({
  passwordInfo,
  updateField,
  onSubmit,
  saving,
}: PasswordSectionProps) {
  return (
    <div className="w-full">
      <section className="grid gap-8 p-6">
        {PASSWORD_FIELDS.map(field => (
          <InfoField
            key={field.key}
            label={field.label}
            type="password"
            placeholder={field.placeholder}
            value={passwordInfo[field.key]}
            onChange={value => updateField(field.key, value)}
          />
        ))}

        <div className="flex justify-end">
          <Button onClick={onSubmit} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </section>
    </div>
  )
}
