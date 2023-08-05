import React, { useEffect } from 'react'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useInit } from '../redux/modules/init/slice'
import { logo } from 'src/assets/brand/logo'
import { WalletButton } from './rainbow/index'

const AppHeader = () => {
  const { dispatchInit } = useInit()

  useEffect(() => {
    dispatchInit()
  }, [])

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <div className="ms-auto">
          <CHeaderNav>
            <WalletButton />
          </CHeaderNav>
        </div>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
