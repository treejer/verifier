import React, { useEffect } from 'react'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import { cilXCircle } from '@coreui/icons'
import { useGetVerifyList } from '../../redux/modules/verifyList'
import { useUserSign } from '../../redux/modules/userSign'
import {
  CCard,
  CBadge,
  CCardLink,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import { ellipsisString } from '../../utilities/hooks/useEllipsis'
import 'react-loading-skeleton/dist/skeleton.css'

const VerifyList = () => {
  const { dispatchActionList, listData } = useGetVerifyList()
  const { userSign } = useUserSign()
  const token = userSign?.access_token

  const removeFromList = (item) => {
    dispatchActionList('removeFromList', item)
  }

  useEffect(() => {
    if (!token) {
      toast.error('Request failed with status code 401')
    }
  }, [token])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex flex-row">
          <h4 id="traffic" className="col-md-10 card-title mb-0">
            Verify List
          </h4>
          <CButton color="primary" variant="outline" onClick={() => console.log('verify')}>
            Verify All Of List
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-15">
                  Planter
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  TreeSpec
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Remove</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {listData.length > 0 &&
                listData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{item.request._id}</CTableDataCell>
                    <CTableDataCell>
                      {item.user.firstName + ' ' + item.user.lastName} (
                      {ellipsisString(item.request.signer, 5)})
                    </CTableDataCell>
                    <CTableDataCell>{ellipsisString(item.request.treeSpecs, 9)}</CTableDataCell>
                    <CTableDataCell>
                      {moment(item.request.createdAt).format('YYYY-MM-DD - hh:mm a')}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge
                        color={item.request.status > 0 ? 'success' : 'warning'}
                        className="text-white"
                      >
                        {item.request.status > 0 ? 'active' : 'pending'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CCardLink
                        onClick={() => removeFromList(item)}
                        className="text-decoration-none text-danger"
                      >
                        <CIcon icon={cilXCircle} height={14} className="pe-1" />
                      </CCardLink>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default VerifyList
