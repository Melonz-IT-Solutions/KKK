import {
  Home,
  Users,
  Settings2Icon,
  History,
  IdCard,
  FilePenLine,
  Building2,
  GitBranch,
} from 'lucide-react'

export const NavigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <Home />,
  },

  {
    title: 'Members',
    url: '/members',
    icon: <Users />,
  },
  {
    title: 'Staff',
    url: '/staff',
    icon: <IdCard />,
  },
  {
    title: 'Clusters',
    url: '/clusters',
    icon: <Building2 />,
  },
  {
    title: 'Branches',
    url: '/branches',
    icon: <GitBranch />,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: <Settings2Icon />,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: <FilePenLine />,
  },
  {
    title: 'Activity Logs',
    url: '/activity-log',
    icon: <History />,
  },
]
