import { Home, Users, Settings2Icon, User2Icon, ChartColumn } from 'lucide-react'

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
    icon: <User2Icon />,
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
    icon: <ChartColumn />,
  },
]
