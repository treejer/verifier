import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Dashboard = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={3}>
              <iframe
                src="https://dune.xyz/embeds/395442/754726/c9d5baae-33e5-412a-834a-fb90ad6be4e0"
                height="250"
                width="100%"
                title="chart 1"
              ></iframe>
            </CCol>
            <CCol sm={3}>
              <iframe
                src="https://dune.xyz/embeds/417869/797100/c9ea90ea-a3e7-4e12-88ec-1c7b89e73afe"
                height="250"
                width="100%"
                title="chart 2"
              ></iframe>
            </CCol>
            <CCol sm={3}>
              <iframe
                src="https://dune.xyz/embeds/417906/797152/6470e53b-3c75-4629-ad03-fcc45d7be7dd"
                height="250"
                width="100%"
                title="chart 3"
              ></iframe>
            </CCol>
            <CCol sm={3}>
              <iframe
                src="https://dune.xyz/embeds/417899/797146/f06688fa-8fb6-4dba-a4ad-f8fb071f6859"
                height="250"
                width="100%"
                title="chart 3"
              ></iframe>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <iframe
                src="https://dune.xyz/embeds/395828/755409/2d131dd7-a565-4ae6-875c-4d7bee163bf2"
                height="500"
                width="100%"
                title="chart 5"
              ></iframe>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
