import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilSpeedometer,
  cilShieldAlt,
  cilPlant,
  cilLayers,
  cilListRich,
} from '@coreui/icons'
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
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Requests',
    to: '/requests',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Verify List',
    to: '/verifylist',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Trees',
    to: '/trees',
    icon: <CIcon icon={cilPlant} customClassName="nav-icon" />,
  },
]

export default _nav
