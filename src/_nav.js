import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilSpeedometer, cilShieldAlt, cilPlant } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/Users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Trees',
    to: '/trees',
    icon: <CIcon icon={cilPlant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Setting',
    to: '/shields',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
  },
]

export default _nav
