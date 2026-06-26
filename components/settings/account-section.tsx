import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Button from '@/components/button';
import { Save } from 'lucide-react';

import InfoField from './info-field';
import RoleBadges from './role-badges';
import { ACCOUNT_FIELDS } from '@/lib/data/settings';

type AccountInfo = {
  fullName: string;
  username: string;
  department: string;
  contactNumber: string;
};

interface AccountSectionProps {
  roles: string[];
  addRole: (role: string) => void;
  removeRole: (role: string) => void;

  accountInfo: AccountInfo;
  updateField: (field: keyof AccountInfo, value: string) => void;

  accountStatus: 'active' | 'deactivated';
  toggleAccountStatus: () => void;
}

export default function AccountSection({
  roles,
  addRole,
  removeRole,
  accountInfo,
  updateField,
  accountStatus,
  toggleAccountStatus,
}: AccountSectionProps) {
  return (
    <div className="w-full">
      <section className="p-6 border">
        {/* HEADER */}
        <div className="mb-6 flex justify-between pb-4 ">
          <div>
            <h3 className="text-xl font-semibold">Account Information</h3>
          </div>
          <Badge variant="outline">Profile</Badge>
        </div>

        {/* FIELDS GRID */}
        <div className="grid gap-4 md:grid-cols-2 ">
          {ACCOUNT_FIELDS.map((field) => (
            <InfoField
              key={field.key}
              label={field.label}
              value={accountInfo[field.key]}
              onChange={(value) => updateField(field.key, value)}
            />
          ))}

          {/* ROLES */}
          <div className="md:col-span-2">
            <RoleBadges
              roles={roles}
              addRole={addRole}
              removeRole={removeRole}
            />
          </div>

          {/* ACCOUNT STATUS */}
          <div className="md:col-span-2 flex items-center justify-between p-4 ">
            <div>
              <span className="font-medium">Account Status</span>

              <p className="text-sm text-muted-foreground">
                {accountStatus === 'active'
                  ? 'Active accounts can access the KMFI system resources.'
                  : 'Deactivated accounts cannot access the KMFI system resources.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={accountStatus === 'active'}
                onCheckedChange={toggleAccountStatus}
              />

              <span className="text-sm capitalize">{accountStatus}</span>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end md:col-span-2">
            <Button>
              <Save className="mr-2" size={16} />
              Update Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
