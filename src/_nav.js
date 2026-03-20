export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Theme',
  },
    {
    component: 'CNavItem',
    name: 'Roles',
    to: '/role',
    icon: 'cil-pencil',
    items: [
      {
        component: 'CNavItem',
        name: 'View',
        to: '/role/view',
      },
      {
        component: 'CNavItem',
        name: 'Create',
        to: '/role/create',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'User',
    to: '/user',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'View',
        to: '/user/view',
      },
      {
        component: 'CNavItem',
        name: 'Create',
        to: '/user/newregister',
      },
    ],
  },
]
