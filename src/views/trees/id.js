import React, { useEffect, useState } from 'react'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import {
  CCardLink,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CFormLabel,
} from '@coreui/react'
import { useGetTreeDetail } from '../../redux/modules/treeDetail'
import { useUserSign } from '../../redux/modules/userSign'
import { toast } from 'react-toastify'
const TreeDetailsForm = () => {
  const { dispatchGetTreeDetail, data: treeData } = useGetTreeDetail()
  const { id } = useParams()
  const { userSign } = useUserSign()
  const token = userSign?.access_token
  const [treeFlag, setTreeFlag] = useState(false)
  const [treeDetail, setTreeDetail] = useState({
    id: null,
    birthDate: null,
    countryCode: null,
    createdAt: null,
    plantDate: null,
    planter: null,
    treeStatus: null,
    treeSpecs: null,
    treeSpecsEntity: null,
  })
  useEffect(() => {
    if (token && !treeFlag) {
      dispatchGetTreeDetail(id)
      setTreeFlag(true)
    } else if (!token) {
      toast.error('Request failed with status code 401')
    }

    if (treeData && token && treeFlag) {
      if (decToHex(id) === treeData.id) {
        setTreeDetail(treeData)
      }
    }

    return () => {
      setTreeFlag(false)
    }
  }, [id, treeData])

  const decToHex = (decimalNumber) => {
    const id = parseInt(decimalNumber)
    return `0x${id.toString(16)}`
  }

  return (
    <>
      <CCardLink href="#/trees" className="d-flex align-items-center mb-2 text-decoration-none">
        <CIcon icon={cilChevronLeft} height={14} className="pe-1" />
        Back
      </CCardLink>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            Tree Detail
          </h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol className="col-3 mb-5 text-center">
              <CCol className="mt-5 d-flex flex-column align-items-center">
                <CButton
                  color="primary"
                  variant="outline"
                  className="d-flex mb-2 w-50 justify-content-center"
                >
                  Verify Update
                </CButton>
                <CButton
                  className="d-flex mb-2 w-50 justify-content-center"
                  color="primary"
                  variant="outline"
                >
                  Reject Update
                </CButton>
              </CCol>
            </CCol>
            <CCol className="col-9 mb-2">
              <CRow>
                <CCol className="col-12 mb-2">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4 d-flex align-items-center justify-content-between">
                        <span>Tree Detail</span>
                      </h6>
                      <CRow>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              ID:
                            </CFormLabel>
                            {treeDetail.id || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Birth date:
                            </CFormLabel>
                            {treeDetail.birthDate || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Country Code:
                            </CFormLabel>
                            {treeDetail.countryCode || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            CreatedAt:
                          </CFormLabel>
                          {treeDetail.createdAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Plant date:
                            </CFormLabel>
                            {treeDetail.plantDate}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Planter:
                          </CFormLabel>
                          {treeDetail.planter?.id || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Status:
                          </CFormLabel>
                          {treeDetail.treeStatus || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            TreeSpecs:
                          </CFormLabel>
                          <a
                            href={`https://ipfs.treejer.com/ipfs/${treeDetail.treeSpecs}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {treeDetail.treeSpecs || ''}
                          </a>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Tree Specs Entity:
                          </CFormLabel>
                          <a
                            href={
                              'https://google.com/maps?q=loc:' +
                              treeDetail.treeSpecsEntity?.latitude / Math.pow(10, 6) +
                              ',' +
                              treeDetail.treeSpecsEntity?.longitude / Math.pow(10, 6)
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {treeDetail.treeSpecsEntity?.latitude / Math.pow(10, 6)}
                            {'-'} {treeDetail.treeSpecsEntity?.longitude / Math.pow(10, 6)}
                          </a>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Nursery:
                          </CFormLabel>
                          {treeDetail.treeSpecsEntity?.nursery ? 'Yes' : 'No'}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              {treeDetail.treeSpecsEntity &&
                JSON.parse(treeDetail.treeSpecsEntity?.updates).length > 0 && (
                  <CCol className="col-6 mb-2">
                    <CCard className="bg-white">
                      <CCardBody>
                        {JSON.parse(treeDetail.treeSpecsEntity?.updates).map((update, index) => (
                          <div key={`div${index}`}>
                            <>
                              <h6 className="border-bottom pb-2 mb-4">
                                Update:
                                {moment(Number(update.created_at * 1000)).format(
                                  'MM/DD/YYYY - hh:mm a',
                                )}
                              </h6>
                              <img src={update.image} alt={update.created_at} className="w-100" />
                            </>
                          </div>
                        ))}
                      </CCardBody>
                    </CCard>
                  </CCol>
                )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default TreeDetailsForm
