import { Input } from '@/components/ui/input'
import Button from '@/components/button'
import { Save } from 'lucide-react'
import { Badge } from '../ui/badge'

export default function PasswordSection() {
  return (
    <div className="w-full">
      <div className="grid gap-6 border p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Security: Change Password </h2>
          <Badge variant="outline">Secure</Badge>
        </div>
        <div>
          <label className="text-sm font-medium">Current Password</label>
          <Input placeholder="**********" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input placeholder="**********" />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input placeholder="**********" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            <Save />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
