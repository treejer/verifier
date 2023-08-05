import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useToggleSidebar } from '../redux/modules/init/slice'

const DefaultLayout = () => {
  const { sidebarShow, toggleSidebar } = useToggleSidebar()
  return (
    <div>
      <AppSidebar />
      <div
        className={
          sidebarShow
            ? 'wrapper d-flex flex-column min-vh-100 bg-light'
            : 'wrapper d-flex flex-column min-vh-100 bg-light collapsed-wrapper'
        }
      >
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
