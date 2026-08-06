import {
  UserPlus,
  Wallet,
  UserPen,
  Building2,
  UserMinus,
  LogIn,
  LogOut,
} from 'lucide-react';

export const activityConfig = {
  'New Manager Created': {
    icon: UserPlus,
  },

  'Budget Approved': {
    icon: Wallet,
  },

  'Updated Profile': {
    icon: UserPen,
  },

  'Department Updated': {
    icon: Building2,
  },

  'Member Removed': {
    icon: UserMinus,
  },

  'Member Login': {
    icon: LogIn,
  },

  'Member Logout': {
    icon: LogOut,
  },
} as const;
