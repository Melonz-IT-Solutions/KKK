import { Home, Users, Settings2Icon, History, IdCard } from 'lucide-react';
import { ur } from 'zod/v4/locales';

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
    title: 'Active Log',
    url: '/activelog',
    icon: <History />,
  },
];
