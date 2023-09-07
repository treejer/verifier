import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users'))
const UsersDetail = React.lazy(() => import('./views/users/id'))
const Planters = React.lazy(() => import('./views/planters'))
const PlanterDetail = React.lazy(() => import('./views/planters/id'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/:id', name: 'Users', element: UsersDetail },
  { path: '/planters', name: 'Planters', element: Planters },
  { path: '/planters/:id', name: 'Planters Detail', element: PlanterDetail },
]

export default routes
