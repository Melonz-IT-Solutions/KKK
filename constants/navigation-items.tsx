import { Home, Users, Settings2Icon,  History, IdCard } from 'lucide-react'
import { ur } from 'zod/v4/locales'


export const NavigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <Home />,
    items: [
      {title: 'Finance',
      url: '/dashboard/finance',
      },
      {
        title: 'Engineering',
        url: '/dashboard/engineering',
      },
    ],
  },
  {
    title: 'Department',
    url: '/department',
    icon: <Home />,
    items: [
      {title: 'Data Table',
      url: '/department/finance',
      },
      {
        title: 'Export Function',
        url: '/department/engineering',
      },
    ],
  },
  {
    title: 'Members',
    url: '/members',
    icon: <Users />,
    items: [
      {title: 'Data Table',
      url: '/members/datatable',
      },
      {
        title: 'Export Function',
        url: '/members/exportfunction',
      },
    ],
  },
  {
    title: 'Staff',
    url: '/staff',
    icon: <IdCard />,
  },
  {
    title: 'Active Log',
    url: '/activelog',
    icon: <History />,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: <Settings2Icon />,
    items: [],
  },
]
