'use client'

import * as React from 'react'
import { UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────────────────────

type Department = 'Finance' | 'MIS'

type StaffMember = {
  id: string
  department: Department
  name: string
  email: string
  createdAt: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    department: 'Finance',
    name: 'Maria Santos',
    email: 'maria.santos@kkk.com',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    department: 'MIS',
    name: 'Jose Reyes',
    email: 'jose.reyes@kkk.com',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    department: 'Finance',
    name: 'Ana Garcia',
    email: 'ana.garcia@kkk.com',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    department: 'MIS',
    name: 'Pedro Cruz',
    email: 'pedro.cruz@kkk.com',
    createdAt: '2024-04-05',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Add Staff Dialog ─────────────────────────────────────────────────────────

function AddStaffDialog({ onAdd }: { onAdd: (s: StaffMember) => void }) {
  const [open, setOpen] = React.useState(false)
  const [department, setDepartment] = React.useState<Department | ''>('')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')

  function handleSave() {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    if (!department || !name || !email || !password) return

    onAdd({
      id: Date.now().toString(),
      department: department as Department,
      name,
      email,
      createdAt: new Date().toISOString().split('T')[0],
    })
    setOpen(false)
    resetForm()
  }

  function resetForm() {
    setDepartment('')
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setPasswordError('')
  }

  const isValid =
    department && name && email && password && confirmPassword && password === confirmPassword

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-department">Department</Label>
            <Select
              value={department}
              onValueChange={(v) => setDepartment(v as Department)}
            >
              <SelectTrigger id="staff-department" className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="MIS">MIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-name">Name</Label>
            <Input
              id="staff-name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="email@kkk.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-password">Password</Label>
            <Input
              id="staff-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="staff-confirm-password">Confirm Password</Label>
            <Input
              id="staff-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setPasswordError('')
              }}
              aria-invalid={!!passwordError}
            />
            {passwordError && (
              <p className="text-destructive text-xs">{passwordError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); resetForm() }}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const [staff, setStaff] = React.useState<StaffMember[]>(MOCK_STAFF)

  function handleAdd(member: StaffMember) {
    setStaff((prev) => [...prev, member])
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Toolbar */}
      <div className="flex justify-end">
        <AddStaffDialog onAdd={handleAdd} />
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center"
                >
                  No staff members found.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Badge
                      variant={member.department === 'Finance' ? 'default' : 'secondary'}
                    >
                      {member.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
