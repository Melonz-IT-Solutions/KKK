'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/button'

import PageV2Header from '@/components/headers/page-v2-header'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ChevronDown, Import, SearchIcon, UserPlus } from 'lucide-react'
import MemberV2Table from '@/modules/members/components/member-table/member-v2-table'
import ImportMemberSheet from '@/modules/members/components/import-table/import-member-sheet'
import { AddMemberSheet } from '@/modules/members/components/add-member/member-v2-addmember'
import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'
import { BRANCH_OPTIONS } from '@/modules/members/constants/members'
import type { MemberRow } from '@/modules/members/types/member'

// Fetch the full filtered list in one request — pagination is handled
// entirely client-side inside MemberV2Table. This avoids syncing "page"
// state between the server response and local state, which is a common
// source of subtle pagination bugs (stale page, off-by-one, etc.).
const MAX_MEMBERS_PER_FETCH = 1000

export default function MemberV2Page() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [search, setSearch] = useState('')
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/members?pageSize=${MAX_MEMBERS_PER_FETCH}&search=${encodeURIComponent(search)}&branch=${encodeURIComponent(selectedBranch)}`
    )
    const data = await response.json()
    setMembers(data.items ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void fetchMembers()
  }, [search, selectedBranch])

  const triggerLabel =
    BRANCH_OPTIONS.find(option => option.value === selectedBranch)?.label ??
    'Filter by Cluster / Branch'

  return (
    <div className="p-4">
      <PageV2Header title="Member" description="Manage KKK Members." />
      <div className="flex justify-between">
        {/* Search input */}
        <div className="relative flex gap-6">
          <InputGroup className="h-10">
            <InputGroupInput
              placeholder="Search Member..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
                {triggerLabel}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>City Proper Cluster</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {BRANCH_OPTIONS.slice(0, 5).map(option =>
                  option.value === 'all' ? null : (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setSelectedBranch(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>East Coast Cluster</DropdownMenuLabel>
              {BRANCH_OPTIONS.slice(5).map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSelectedBranch(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="gap-2 rounded-md border-gray-300 bg-white text-black hover:bg-gray-50"
            onClick={() => setIsImportOpen(true)}
          >
            <Import />
            Import File
          </Button>

          <Button onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus />
            Add Member
          </Button>
          <AddMemberSheet
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
            onSave={async values => {
              try {
                const response = await fetch('/api/members', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(values),
                })

                if (!response.ok) {
                  const data = await response.json()

                  throw new Error(data.message ?? 'Failed to add member')
                }

                await fetchMembers()

                showSuccessToast('Successfully added a new member')
              } catch (error) {
                showErrorToast(error instanceof Error ? error.message : 'Failed to add member')
              }
            }}
          />
        </div>

        <ImportMemberSheet
          open={isImportOpen}
          onOpenChange={setIsImportOpen}
          onImported={fetchMembers}
        />
      </div>
      <div>
        <div className="py-6">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading members…</p>
          ) : (
            <MemberV2Table data={members} />
          )}
        </div>
      </div>
    </div>
  )
}
