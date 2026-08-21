'use client'

import Button from '@/components/button'
import { Save } from 'lucide-react'

import InfoField from '@/modules/settings/components/account/info-field'

import type { AccountInfo } from '@/modules/settings/types/settings'

interface AccountSectionProps {
  accountInfo: AccountInfo
  updateField: (field: keyof AccountInfo, value: string) => void
  onSave: () => void
  saving: boolean
}

const ACCOUNT_FIELDS: {
  key: keyof AccountInfo
  label: string
}[] = [
  {
    key: 'firstName',
    label: 'First Name',
  },
  {
    key: 'middleName',
    label: 'Middle Name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'contactNumber',
    label: 'Mobile Number',
  },
]

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
