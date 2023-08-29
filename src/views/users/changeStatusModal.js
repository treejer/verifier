import React from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CModal, CButton, CModalHeader, CModalFooter, CModalTitle } from '@coreui/react'

const ChangeStatusModal = ({ visible, onClose, onReject, onVerify }) => {
  ChangeStatusModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    onVerify: PropTypes.func.isRequired,
  }
  return (
    <CModal backdrop="static" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle> Do you really want to change status?</CModalTitle>
      </CModalHeader>
      <CModalFooter>
        <CRow className="w-100">
          <CCol xs={8}>
            <CButton color="secondary" onClick={onClose}>
              Cancel
            </CButton>
          </CCol>
          <CCol xs={2}>
            <CButton className="text-white" color="danger" onClick={onReject}>
              Reject
            </CButton>
          </CCol>
          <CCol xs={2}>
            <CButton className="text-white" color="primary" onClick={onVerify}>
              Verify
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  )
}

export default ChangeStatusModal
