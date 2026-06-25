'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, Trash2, Upload, UserPlus, Info, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
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
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxSeparator,
  ComboboxEmpty,
} from '@/components/ui/combobox'
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// ─── Types ──────────────────────────────────────────────────────────────────

type Beneficiary = {
  name: string
  birthday: string
  sex: string
  relation: string
}

type Dependent = {
  name: string
  birthday: string
  sex: string
}

type Member = {
  id: string
  membership: 'Regular' | 'Associate'
  name: string
  address: string
  birthday: string
  civilStatus: string
  branch: string
  weeklyContribution: '25' | '50'
  primaryBeneficiary: Beneficiary
  secondaryBeneficiary: Beneficiary
  dependents: Dependent[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateAge(birthday: string): number {
  if (!birthday) return 0
  const today = new Date()
  const birth = new Date(birthday)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    membership: 'Regular',
    name: 'Juan dela Cruz',
    address: 'Talon-Talon, Zamboanga City',
    birthday: '1985-03-15',
    civilStatus: 'Married',
    branch: 'talon-talon',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Maria dela Cruz', birthday: '1987-06-20', sex: 'Female', relation: 'Spouse' },
    secondaryBeneficiary: { name: 'Jose dela Cruz', birthday: '2010-01-10', sex: 'Male', relation: 'Child' },
    dependents: [{ name: 'Jose dela Cruz', birthday: '2010-01-10', sex: 'Male' }],
  },
  {
    id: '2',
    membership: 'Associate',
    name: 'Ana Reyes',
    address: 'Mercedes, Zamboanga City',
    birthday: '1990-07-22',
    civilStatus: 'Single',
    branch: 'mercedes',
    weeklyContribution: '25',
    primaryBeneficiary: { name: 'Pedro Reyes', birthday: '1960-04-05', sex: 'Male', relation: 'Parent' },
    secondaryBeneficiary: { name: 'Luisa Reyes', birthday: '1963-09-12', sex: 'Female', relation: 'Parent' },
    dependents: [],
  },
  {
    id: '3',
    membership: 'Regular',
    name: 'Roberto Santos',
    address: 'Tetuan, Zamboanga City',
    birthday: '1978-11-30',
    civilStatus: 'Married',
    branch: 'tetuan',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Cecilia Santos', birthday: '1980-02-14', sex: 'Female', relation: 'Spouse' },
    secondaryBeneficiary: { name: 'Marco Santos', birthday: '2005-08-25', sex: 'Male', relation: 'Child' },
    dependents: [
      { name: 'Marco Santos', birthday: '2005-08-25', sex: 'Male' },
      { name: 'Liza Santos', birthday: '2008-03-18', sex: 'Female' },
    ],
  },
  {
    id: '4',
    membership: 'Associate',
    name: 'Fatima Hassan',
    address: 'Kabasalan, Zamboanga Sibugay',
    birthday: '1995-05-10',
    civilStatus: 'Single',
    branch: 'kabasalan',
    weeklyContribution: '25',
    primaryBeneficiary: { name: 'Ali Hassan', birthday: '1965-12-01', sex: 'Male', relation: 'Parent' },
    secondaryBeneficiary: { name: '', birthday: '', sex: '', relation: '' },
    dependents: [],
  },
  {
    id: '5',
    membership: 'Regular',
    name: 'Carlos Mendoza',
    address: 'IPIL, Zamboanga Sibugay',
    birthday: '1982-09-08',
    civilStatus: 'Widowed',
    branch: 'ipil',
    weeklyContribution: '50',
    primaryBeneficiary: { name: 'Elena Mendoza', birthday: '2008-07-17', sex: 'Female', relation: 'Child' },
    secondaryBeneficiary: { name: 'Ricardo Mendoza', birthday: '2012-11-23', sex: 'Male', relation: 'Child' },
    dependents: [
      { name: 'Elena Mendoza', birthday: '2008-07-17', sex: 'Female' },
      { name: 'Ricardo Mendoza', birthday: '2012-11-23', sex: 'Male' },
    ],
  },
]

// ─── Branch Filter ────────────────────────────────────────────────────────────

function BranchFilter({
  value,
  onValueChange,
}: {
  value: string | null
  onValueChange: (v: string | null) => void
}) {
  return (
    <Combobox value={value} onValueChange={onValueChange}>
      <ComboboxInput
        placeholder="Filter by branch..."
        className="w-56"
        showClear={!!value}
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>City Proper Cluster</ComboboxLabel>
            <ComboboxItem value="talon-talon">Talon-Talon Branch</ComboboxItem>
            <ComboboxItem value="sta-catalina">Sta. Catalina Branch</ComboboxItem>
            <ComboboxItem value="tetuan">Tetuan Branch</ComboboxItem>
            <ComboboxItem value="putik">Putik Branch</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>East Coast Cluster</ComboboxLabel>
            <ComboboxItem value="mercedes">Mercedes Branch</ComboboxItem>
            <ComboboxItem value="sangali">Sangali Branch</ComboboxItem>
            <ComboboxItem value="cabaluay">Cabaluay Branch</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>West Coast Cluster</ComboboxLabel>
            <ComboboxItem value="sta-maria">Sta. Maria Branch</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Sibugay Cluster</ComboboxLabel>
            <ComboboxItem value="kabasalan">Kabasalan Branch</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Norte Cluster</ComboboxLabel>
            <ComboboxItem value="ipil">IPIL Branch</ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Basulta Cluster</ComboboxLabel>
            <ComboboxItem value="bongao">Bongao Branch</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
        {/* <ComboboxEmpty>No branches found.</ComboboxEmpty> */}
      </ComboboxContent>
    </Combobox>
  )
}

// ─── Import Members Dialog ────────────────────────────────────────────────────

function ImportMembersDialog() {
  const [open, setOpen] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  function handleImport() {
    // TODO: handle actual import
    setOpen(false)
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="size-4" />
          Import File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Members</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import members in bulk.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="text-muted-foreground size-8" />
          {file ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-muted-foreground text-xs">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-sm font-medium">Drop file here or click to browse</p>
              <p className="text-muted-foreground text-xs">Supports .csv, .xlsx, .xls</p>
            </div>
          )}
        </div>

        {file && (
          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <span className="truncate text-sm">{file.name}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Add Member Sheet ─────────────────────────────────────────────────────────

const EMPTY_BENEFICIARY: Beneficiary = { name: '', birthday: '', sex: '', relation: '' }
const EMPTY_DEPENDENT: Dependent = { name: '', birthday: '', sex: '' }

function AddMemberSheet() {
  const [open, setOpen] = React.useState(false)

  // Section I
  const [name, setName] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [birthday, setBirthday] = React.useState('')
  const [civilStatus, setCivilStatus] = React.useState('')
  const [weeklyContribution, setWeeklyContribution] = React.useState('')

  // Section II
  const [primaryBeneficiary, setPrimaryBeneficiary] =
    React.useState<Beneficiary>({ ...EMPTY_BENEFICIARY })
  const [secondaryBeneficiary, setSecondaryBeneficiary] =
    React.useState<Beneficiary>({ ...EMPTY_BENEFICIARY })

  // Section III
  const [dependents, setDependents] = React.useState<Dependent[]>([])

  function handleSave() {
    // TODO: save member
    setOpen(false)
    resetForm()
  }

  function resetForm() {
    setName('')
    setAddress('')
    setBirthday('')
    setCivilStatus('')
    setWeeklyContribution('')
    setPrimaryBeneficiary({ ...EMPTY_BENEFICIARY })
    setSecondaryBeneficiary({ ...EMPTY_BENEFICIARY })
    setDependents([])
  }

  function addDependent() {
    setDependents((prev) => [...prev, { ...EMPTY_DEPENDENT }])
  }

  function removeDependent(index: number) {
    setDependents((prev) => prev.filter((_, i) => i !== index))
  }

  function updateDependent(index: number, field: keyof Dependent, value: string) {
    setDependents((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4" />
          Add Member
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Add Member</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs defaultValue="section1">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="section1" className="flex-1">
                Principal Member
              </TabsTrigger>
              <TabsTrigger value="section2" className="flex-1">
                Beneficiaries
              </TabsTrigger>
              <TabsTrigger value="section3" className="flex-1">
                Dependents
              </TabsTrigger>
            </TabsList>

            {/* Section I – Principal Member */}
            <TabsContent value="section1" className="space-y-4">
              <div className="grid gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="member-name">Name</Label>
                  <Input
                    id="member-name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="member-address">Address</Label>
                  <Input
                    id="member-address"
                    placeholder="Complete address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="member-birthday">Birthday</Label>
                    <Input
                      id="member-birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Age</Label>
                    <Input
                      readOnly
                      value={birthday ? calculateAge(birthday) : ''}
                      placeholder="—"
                      className="bg-muted/40 cursor-default"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="member-civil-status">Civil Status</Label>
                  <Select value={civilStatus} onValueChange={setCivilStatus}>
                    <SelectTrigger id="member-civil-status" className="w-full">
                      <SelectValue placeholder="Select civil status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="member-contribution">Weekly Contribution</Label>
                  <Select
                    value={weeklyContribution}
                    onValueChange={setWeeklyContribution}
                  >
                    <SelectTrigger id="member-contribution" className="w-full">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">₱25.00</SelectItem>
                      <SelectItem value="50">₱50.00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Section II – Beneficiaries */}
            <TabsContent value="section2" className="space-y-5">
              <TooltipProvider>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium">Beneficiaries</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground size-3.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipPrimitive.Portal>
                      <TooltipPrimitive.Content
                        sideOffset={4}
                        className="bg-foreground text-background z-50 inline-flex max-w-xs items-center rounded-md px-3 py-1.5 text-xs"
                      >
                        The beneficiary is the recipient of the claim in case of death of
                        the principal member.
                        <TooltipPrimitive.Arrow className="fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
                      </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                  </Tooltip>
                </div>
              </TooltipProvider>

              {/* Primary Beneficiary */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Primary Beneficiary
                </p>
                <BeneficiaryFields
                  prefix="primary"
                  value={primaryBeneficiary}
                  onChange={setPrimaryBeneficiary}
                />
              </div>

              <Separator />

              {/* Secondary Beneficiary */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Secondary Beneficiary
                </p>
                <BeneficiaryFields
                  prefix="secondary"
                  value={secondaryBeneficiary}
                  onChange={setSecondaryBeneficiary}
                />
              </div>
            </TabsContent>

            {/* Section III – Dependents */}
            <TabsContent value="section3" className="space-y-4">
              <TooltipProvider>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-medium">Dependents</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground size-3.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipPrimitive.Portal>
                      <TooltipPrimitive.Content
                        sideOffset={4}
                        className="bg-foreground text-background z-50 inline-flex max-w-xs items-center rounded-md px-3 py-1.5 text-xs"
                      >
                        For applicable programs only.
                        <TooltipPrimitive.Arrow className="fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
                      </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                  </Tooltip>
                </div>
              </TooltipProvider>

              {dependents.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No dependents added yet.
                </p>
              )}

              {dependents.map((dep, i) => (
                <div key={i} className="relative rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Dependent {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeDependent(i)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Name</Label>
                    <Input
                      placeholder="Full name"
                      value={dep.name}
                      onChange={(e) => updateDependent(i, 'name', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>Birthday</Label>
                      <Input
                        type="date"
                        value={dep.birthday}
                        onChange={(e) => updateDependent(i, 'birthday', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Age</Label>
                      <Input
                        readOnly
                        value={dep.birthday ? calculateAge(dep.birthday) : ''}
                        placeholder="—"
                        className="bg-muted/40 cursor-default"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label>Sex</Label>
                    <Select
                      value={dep.sex}
                      onValueChange={(v) => updateDependent(i, 'sex', v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addDependent}
              >
                <Plus className="size-4" />
                Add Dependent
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="border-t px-6 py-4 gap-2">
          <SheetClose asChild>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </SheetClose>
          <Button onClick={handleSave}>Save Member</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── Beneficiary Fields ───────────────────────────────────────────────────────

function BeneficiaryFields({
  prefix,
  value,
  onChange,
}: {
  prefix: string
  value: Beneficiary
  onChange: (v: Beneficiary) => void
}) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-name`}>Name</Label>
        <Input
          id={`${prefix}-name`}
          placeholder="Full name"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${prefix}-birthday`}>Birthday</Label>
          <Input
            id={`${prefix}-birthday`}
            type="date"
            value={value.birthday}
            onChange={(e) => onChange({ ...value, birthday: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Age</Label>
          <Input
            readOnly
            value={value.birthday ? calculateAge(value.birthday) : ''}
            placeholder="—"
            className="bg-muted/40 cursor-default"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${prefix}-sex`}>Sex</Label>
          <Select value={value.sex} onValueChange={(v) => onChange({ ...value, sex: v })}>
            <SelectTrigger id={`${prefix}-sex`} className="w-full">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${prefix}-relation`}>Relation</Label>
          <Select
            value={value.relation}
            onValueChange={(v) => onChange({ ...value, relation: v })}
          >
            <SelectTrigger id={`${prefix}-relation`} className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

function DeleteMemberDialog({
  member,
  onConfirm,
}: {
  member: Member
  onConfirm: () => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{member.name}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  const router = useRouter()
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(null)
  const [members, setMembers] = React.useState<Member[]>(MOCK_MEMBERS)

  const filteredMembers = selectedBranch
    ? members.filter((m) => m.branch === selectedBranch)
    : members

  function handleDelete(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BranchFilter value={selectedBranch} onValueChange={setSelectedBranch} />
        <div className="flex items-center gap-2">
          <ImportMembersDialog />
          <AddMemberSheet />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membership</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Civil Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Badge
                      variant={member.membership === 'Regular' ? 'default' : 'secondary'}
                    >
                      {member.membership}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-48 truncate">
                    {member.address}
                  </TableCell>
                  <TableCell>
                    {new Date(member.birthday).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{calculateAge(member.birthday)}</TableCell>
                  <TableCell>{member.civilStatus}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <ButtonGroup>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => router.push(`/members/${member.id}`)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <ButtonGroupSeparator />
                        <Button variant="outline" size="icon-sm">
                          <Pencil className="size-4" />
                        </Button>
                        <ButtonGroupSeparator />
                        <DeleteMemberDialog
                          member={member}
                          onConfirm={() => handleDelete(member.id)}
                        />
                      </ButtonGroup>
                    </div>
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
