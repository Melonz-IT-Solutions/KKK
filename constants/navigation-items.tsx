import { Home, Users, Settings2Icon, User2Icon, FilePenLine, Book } from 'lucide-react'

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
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: <FilePenLine />,
  },
  {
    title: 'Activity Logs',
    url: '/activity-logs',
    icon: <Book />,
  },
]
