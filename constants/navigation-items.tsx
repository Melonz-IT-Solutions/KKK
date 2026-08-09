import { Home, Users, Settings2Icon, History, IdCard } from 'lucide-react'

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
    items: [],
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: <Home />,
  },
  {
    title: 'Activity Log',
    url: '/activity-log',
    icon: <History />,
  },
]
