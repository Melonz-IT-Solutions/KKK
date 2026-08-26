import { Home, Users, Settings2Icon, History, IdCard, FilePenLine } from 'lucide-react'

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
    title: 'Activity Log',
    url: '/activity-log',
    icon: <History />,
  },
]
