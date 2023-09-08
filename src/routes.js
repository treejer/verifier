import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Users = React.lazy(() => import('./views/users'))
const UsersDetail = React.lazy(() => import('./views/users/id'))
const Requests = React.lazy(() => import('./views/requests'))
const RequestDetail = React.lazy(() => import('./views/requests/id'))
const VerifyList = React.lazy(() => import('./views/verify'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/:id', name: 'Users', element: UsersDetail },
  { path: '/requests', name: 'Requests', element: Requests },
  { path: '/requests/:action/:id', name: 'Request Detail', element: RequestDetail },
  { path: '/verifylist', name: 'Verify List', element: VerifyList },
]

export default routes
