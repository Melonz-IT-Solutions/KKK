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
    key: 'address',
    label: 'Address',
  },
  {
    key: 'civilStatus',
    label: 'Civil Status',
  },
]

// ---------------------------------------------------------------------------
// Branch options
// ---------------------------------------------------------------------------

export const BRANCH_OPTIONS: BranchOption[] = [
  // CITY PROPER CLUSTER
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

  // EAST COAST CLUSTER
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

  // WEST COAST CLUSTER
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

  // SIBUGAY CLUSTER
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

  // NORTH CLUSTER
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

  // BASULTA CLUSTER
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
]
