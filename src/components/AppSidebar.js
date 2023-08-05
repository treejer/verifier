import React from 'react'
import { useSelector } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import navigation from '../_nav'
import { useToggleSidebar } from '../redux/modules/init/slice'

const AppSidebar = () => {
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const { sidebarShow, toggleSidebar } = useToggleSidebar()

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      className={sidebarShow ? 'margin-left-0' : 'collapsed-menu'}
    >
      <CSidebarBrand to="/">
        <CIcon className="sidebar-brand-full" icon={logo} height={100} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler onClick={toggleSidebar} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
