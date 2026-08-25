import type { BranchOption, MemberColumn } from '@/modules/members/types/member'

// ---------------------------------------------------------------------------
// Member table
// ---------------------------------------------------------------------------

export const MEMBER_TABLE_COLUMNS: MemberColumn[] = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'membership',
    label: 'Membership',
  },
  {
    key: 'age',
    label: 'Age',
  },
  {
    key: 'branch',
    label: 'Branch',
  },
  {
    key: 'civilStatus',
    label: 'Civil Status',
  },
]

// ---------------------------------------------------------------------------
// Branch options
// ---------------------------------------------------------------------------

export const BRANCH_CLUSTERS = {
  city_proper_cluster: [
    {
      label: 'Talon-Talon Branch',
      value: 'talon-talon',
    },
    {
      label: 'Sta. Catalina Branch',
      value: 'sta-catalina',
    },
    {
      label: 'Tetuan Branch',
      value: 'tetuan',
    },
    {
      label: 'Putik Branch',
      value: 'putik',
    },
  ],

  east_coast_cluster: [
    {
      label: 'Mercedes Branch',
      value: 'mercedes',
    },
    {
      label: 'Sangali Branch',
      value: 'sangali',
    },
    {
      label: 'Cabaluay Branch',
      value: 'cabaluay',
    },
    {
      label: 'Vitali Branch',
      value: 'vitali',
    },
  ],

  west_coast_cluster: [
    {
      label: 'Sta. Maria Branch',
      value: 'sta-maria',
    },
    {
      label: 'Talisayan Branch',
      value: 'talisayan',
    },
    {
      label: 'Maasin Branch',
      value: 'maasin',
    },
    {
      label: 'Sinunuc Branch',
      value: 'sinunuc',
    },
  ],

  sibugay_cluster: [
    {
      label: 'Kabasalan Branch',
      value: 'kabasalan',
    },
    {
      label: 'Imelda Branch',
      value: 'imelda',
    },
    {
      label: 'Buug Branch',
      value: 'buug',
    },
  ],

  north_cluster: [
    {
      label: 'Ipil Branch',
      value: 'ipil',
    },
    {
      label: 'Siocon Branch',
      value: 'siocon',
    },
    {
      label: 'Liloy Branch',
      value: 'liloy',
    },
  ],

  basulta_cluster: [
    {
      label: 'Bongao Branch',
      value: 'bongao',
    },
    {
      label: 'Isabela Branch',
      value: 'isabela',
    },
    {
      label: 'Lamitan Branch',
      value: 'lamitan',
    },
  ],
} satisfies Record<string, BranchOption[]>

export const BRANCH_OPTIONS: BranchOption[] = Object.values(BRANCH_CLUSTERS).flat()
