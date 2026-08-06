import Button from '@/components/button';
import { Save } from 'lucide-react';
import CardHeader from '../../../components/headers/card-header';
import InfoField from './info-field';
import type { PasswordSectionProps } from '@/types/accountfield';

export default function PasswordSection({
  passwordInfo,
  updateField,
  onSubmit,
}: PasswordSectionProps) {
  return (
    <div className='w-full'>
      <section className='grid gap-6 border p-6'>
        <CardHeader title='Security: Change Password' badge='Secure' />
        <InfoField
          label='Current Password'
          type='password'
          placeholder='**********'
          value={passwordInfo.currentPassword}
          onChange={(value) => updateField('currentPassword', value)}
        />

        <div className='grid gap-6 md:grid-cols-2'>
          <InfoField
            label='New Password'
            type='password'
            placeholder='**********'
            value={passwordInfo.newPassword}
            onChange={(value) => updateField('newPassword', value)}
          />

          <InfoField
            label='Confirm New Password'
            type='password'
            placeholder='**********'
            value={passwordInfo.confirmPassword}
            onChange={(value) => updateField('confirmPassword', value)}
          />
        </div>

        <div className='flex justify-end'>
          <Button onClick={onSubmit}>
            <Save />
            Save Changes
          </Button>
        </div>
      </section>
    </div>
  );
}
