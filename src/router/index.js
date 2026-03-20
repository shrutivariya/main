
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '../pages/DefaultLayout.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import assignRole from '../pages/assignRole.vue'
import newRegister from '../pages/newRegister.vue'
import addExcelData from '../pages/addExcelData.vue'
import viewRole from '../pages/viewRole.vue'
import viewUser from '../pages/viewUser.vue'

const routes = [
   {
     path: '/',
     redirect: '/login',
   },
   {
     path: '/login',
     name: 'Login',
     component: Login,
   },
   {
    path: '/',
    component: DefaultLayout,       // Parent layout
    meta: { requiresAuth: true },   // Auth required for all children
    children: [
      { path: '/dashboard', name: 'Dashboard' ,component: Dashboard},
      { path: '/role/create', name: 'Role/ Create' ,component: assignRole},
      { path: '/role/view', name: 'Role/ View' ,component: viewRole},
      { path: '/user/newregister', name: 'User/ Register' ,component: newRegister},
      { path: '/user/view', name: 'User/ View' ,component: viewUser},
      { path: '/addExcelData', name: 'Dashboard/ AddExcelData' ,component: addExcelData},
      // Add more protected routes here
    ],
  },

    //     {
    //     path: '/theme',
    //     name: 'Theme',
    //     redirect: '/theme/typography',
    //   },
    //   {
    //     path: '/theme/colors',
    //     name: 'Colors',
    //     component: () => import('@/theme/Colors.vue'),
    //   },
    //   {
    //     path: '/theme/typography',
    //     name: 'Typography',
    //     component: () => import('@/theme/Typography.vue'),
    //   },
    //   {
    //     path: '/base',
    //     name: 'Base',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     redirect: '/base/breadcrumbs',
    //     children: [
    //       {
    //         path: '/base/accordion',
    //         name: 'Accordion',
    //         component: () => import('@/base/Accordion.vue'),
    //       },
    //       {
    //         path: '/base/breadcrumbs',
    //         name: 'Breadcrumbs',
    //         component: () => import('@/base/Breadcrumbs.vue'),
    //       },
    //       {
    //         path: '/base/cards',
    //         name: 'Cards',
    //         component: () => import('@/base/Cards.vue'),
    //       },
    //       {
    //         path: '/base/carousels',
    //         name: 'Carousels',
    //         component: () => import('@/base/Carousels.vue'),
    //       },
    //       {
    //         path: '/base/collapses',
    //         name: 'Collapses',
    //         component: () => import('@/base/Collapses.vue'),
    //       },
    //       {
    //         path: '/base/list-groups',
    //         name: 'List Groups',
    //         component: () => import('@/base/ListGroups.vue'),
    //       },
    //       {
    //         path: '/base/navs',
    //         name: 'Navs',
    //         component: () => import('@/base/Navs.vue'),
    //       },
    //       {
    //         path: '/base/paginations',
    //         name: 'Paginations',
    //         component: () => import('@/base/Paginations.vue'),
    //       },
    //       {
    //         path: '/base/placeholders',
    //         name: 'Placeholders',
    //         component: () => import('@/base/Placeholders.vue'),
    //       },
    //       {
    //         path: '/base/popovers',
    //         name: 'Popovers',
    //         component: () => import('@/base/Popovers.vue'),
    //       },
    //       {
    //         path: '/base/progress',
    //         name: 'Progress',
    //         component: () => import('@/base/Progress.vue'),
    //       },
    //       {
    //         path: '/base/spinners',
    //         name: 'Spinners',
    //         component: () => import('@/base/Spinners.vue'),
    //       },
    //       {
    //         path: '/base/tables',
    //         name: 'Tables',
    //         component: () => import('@/base/Tables.vue'),
    //       },
    //       {
    //         path: '/base/tabs',
    //         name: 'Tabs',
    //         component: () => import('@/base/Tabs.vue'),
    //       },
    //       {
    //         path: '/base/tooltips',
    //         name: 'Tooltips',
    //         component: () => import('@/base/Tooltips.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/buttons',
    //     name: 'Buttons',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     redirect: '/buttons/standard-buttons',
    //     children: [
    //       {
    //         path: '/buttons/standard-buttons',
    //         name: 'Button Component',
    //         component: () => import('@/buttons/Buttons.vue'),
    //       },
    //       {
    //         path: '/buttons/dropdowns',
    //         name: 'Dropdowns',
    //         component: () => import('@/buttons/Dropdowns.vue'),
    //       },
    //       {
    //         path: '/buttons/button-groups',
    //         name: 'Button Groups',
    //         component: () => import('@/buttons/ButtonGroups.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/forms',
    //     name: 'Forms',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     redirect: '/forms/form-control',
    //     children: [
    //       {
    //         path: '/forms/form-control',
    //         name: 'Form Control',
    //         component: () => import('@/forms/FormControl.vue'),
    //       },
    //       {
    //         path: '/forms/select',
    //         name: 'Select',
    //         component: () => import('@/forms/Select.vue'),
    //       },
    //       {
    //         path: '/forms/checks-radios',
    //         name: 'Checks & Radios',
    //         component: () => import('@/forms/ChecksRadios.vue'),
    //       },
    //       {
    //         path: '/forms/range',
    //         name: 'Range',
    //         component: () => import('@/forms/Range.vue'),
    //       },
    //       {
    //         path: '/forms/input-group',
    //         name: 'Input Group',
    //         component: () => import('@/forms/InputGroup.vue'),
    //       },
    //       {
    //         path: '/forms/floating-labels',
    //         name: 'Floating Labels',
    //         component: () => import('@/forms/FloatingLabels.vue'),
    //       },
    //       {
    //         path: '/forms/layout',
    //         name: 'Layout',
    //         component: () => import('@/forms/Layout.vue'),
    //       },
    //       {
    //         path: '/forms/validation',
    //         name: 'Validation',
    //         component: () => import('@/forms/Validation.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/charts',
    //     name: 'Charts',
    //     component: () => import('@/charts/Charts.vue'),
    //   },
    //   {
    //     path: '/icons',
    //     name: 'Icons',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     redirect: '/icons/coreui-icons',
    //     children: [
    //       {
    //         path: '/icons/coreui-icons',
    //         name: 'CoreUI Icons',
    //         component: () => import('@/icons/CoreUIIcons.vue'),
    //       },
    //       {
    //         path: '/icons/brands',
    //         name: 'Brands',
    //         component: () => import('@/icons/Brands.vue'),
    //       },
    //       {
    //         path: '/icons/flags',
    //         name: 'Flags',
    //         component: () => import('@/icons/Flags.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/notifications',
    //     name: 'Notifications',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     redirect: '/notifications/alerts',
    //     children: [
    //       {
    //         path: '/notifications/alerts',
    //         name: 'Alerts',
    //         component: () => import('@/notifications/Alerts.vue'),
    //       },
    //       {
    //         path: '/notifications/badges',
    //         name: 'Badges',
    //         component: () => import('@/notifications/Badges.vue'),
    //       },
    //       {
    //         path: '/notifications/modals',
    //         name: 'Modals',
    //         component: () => import('@/notifications/Modals.vue'),
    //       },
    //       {
    //         path: '/notifications/toasts',
    //         name: 'Toasts',
    //         component: () => import('@/notifications/Toasts.vue'),
    //       },
    //     ],
    //   },
    //   {
    //     path: '/widgets',
    //     name: 'Widgets',
    //     component: () => import('@/widgets/Widgets.vue'),
    //   },
     
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // Check if token exists

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // If already logged in, redirect away from login
    next('/dashboard')
  } else {
    next() // Continue as normal
  }
})

export default router
