import React, { useEffect, useState } from 'react'
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
import useTreeFactoryContract from '../../utilities/hooks/useTreeFactoryContract'
import { useWeb3 } from '../../redux/modules/web3/slice'
import 'react-loading-skeleton/dist/skeleton.css'

const VerifyList = () => {
  const { web3 } = useWeb3()
  const { userSign } = useUserSign()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { dispatchActionList, listData } = useGetVerifyList()
  const { contractResponse, dispatchVerifyList } = useTreeFactoryContract()
  const token = userSign?.access_token

  const removeFromList = (item) => {
    dispatchActionList('removeFromList', item)
  }

  const dispatchVerify = () => {
    dispatchVerifyList('verify')
    setLoadingBtn(true)
  }

  useEffect(() => {
    if (!token) {
      toast.error('Request failed with status code 401')
    }

    if (contractResponse) {
      setLoadingBtn(false)
      if (contractResponse.hash) {
        const textWithLink = (
          <div>
            <p>{contractResponse.hash?.message}</p>
            <p>
              <a
                href={`${web3.config.exp_url}/tx/${contractResponse.hash?.detail?.transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                Transaction Link
              </a>
            </p>
          </div>
        )
        toast.success(textWithLink)
      } else if (contractResponse.success) {
        toast.success(contractResponse.success?.message)
      } else if (contractResponse.error) {
        toast.error(contractResponse.error.message)
      }
    }
  }, [token, contractResponse])

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex flex-row">
          <h4 id="traffic" className="col-md-10 card-title mb-0">
            Verify List
          </h4>
          <CButton color="primary" variant="outline" onClick={dispatchVerify} disabled={loadingBtn}>
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
              {listData &&
                listData.length > 0 &&
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
