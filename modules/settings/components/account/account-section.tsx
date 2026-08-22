'use client'

import { Save } from 'lucide-react'

import Button from '@/components/button'
import InfoField from '@/modules/settings/components/info-field'

import { ACCOUNT_FIELDS } from '@/modules/settings/data/settings'

import type { AccountSectionProps } from '@/modules/settings/types/settings'

export default function AccountSection({
  accountInfo,
  updateField,
  onSave,
  saving,
}: AccountSectionProps) {
  return (
    <div className="w-full">
      <section className="p-6">
        <div className="flex flex-col gap-8">
          {ACCOUNT_FIELDS.map(field => (
            <InfoField
              key={field.key}
              label={field.label}
              value={accountInfo[field.key]}
              onChange={value => updateField(field.key, value)}
            />
          ))}

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Updating...' : 'Update Account'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
