import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Dashboard = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            Treejer Dashboard Title
          </h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
