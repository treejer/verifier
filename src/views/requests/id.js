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
import { useGetVerifyList } from '../../redux/modules/verifyList'
import { useGetRequestDetail } from '../../redux/modules/requestDetail'
import { ellipsisString } from '../../utilities/hooks/useEllipsis'
import { createMapUrl } from '../../utilities/hooks/useMap'
import { useUserSign } from '../../redux/modules/userSign'
import { toast } from 'react-toastify'

const PlantDetails = () => {
  const [treeFlag, setTreeFlag] = useState(false)
  const [exist, setExist] = useState(false)
  const { action, id } = useParams()
  const { userSign } = useUserSign()
  const {
    dispatchGetRequestDetail,
    requestDetailData,
    error: treeError,
    loading: treeLoading,
  } = useGetRequestDetail()
  const { dispatchActionList, existInList } = useGetVerifyList()
  const token = userSign?.access_token

  const deleteTreeAction = async () => {
    dispatchGetRequestDetail('deleteData', action, id)
  }

  const handleBasket = () => {
    if (exist) {
      dispatchActionList('removeFromList', requestDetailData)
      toast.info('Plan remove from your verify list')
    } else {
      dispatchActionList('addToList', requestDetailData)
      toast.success('Plan successfully add to your verify list')
    }
    setExist(!exist)
  }

  useEffect(() => {
    if (token && !treeFlag) {
      dispatchGetRequestDetail('getData', action, id)
      existInList(id) ? setExist(true) : setExist(false)
      setTreeFlag(true)
    }

    if (treeError) {
      toast.error(treeError.message)
    }

    return () => {
      if (treeFlag) {
        setTreeFlag(false)
        dispatchGetRequestDetail('getData', 'reset', id)
      }
    }
  }, [id, token, treeError, requestDetailData])

  return (
    <>
      <CCardLink href="#/requests" className="d-flex align-items-center mb-2 text-decoration-none">
        <CIcon icon={cilChevronLeft} height={14} className="pe-1" />
        Back
      </CCardLink>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            Plant Detail
          </h4>
        </CCardHeader>
        <CCardBody>
          {requestDetailData && !treeLoading && (
            <CRow>
              <CCol className="col-3 mb-5 text-center">
                <CCol className="mt-5 d-flex flex-column align-items-center">
                  <CButton
                    color="primary"
                    variant="outline"
                    className="d-flex mb-2 w-75 justify-content-center"
                    onClick={deleteTreeAction}
                  >
                    Delete
                  </CButton>

                  <CButton
                    color={exist ? 'danger' : 'primary'}
                    variant="outline"
                    className="d-flex mb-2 w-75 justify-content-center"
                    onClick={requestDetailData && handleBasket}
                  >
                    {exist ? 'Remove From' : 'Add To'} Verify List
                  </CButton>
                </CCol>
              </CCol>
              <CCol className="col-9 mb-0">
                <CRow>
                  <CCol className="col-12 mb-2">
                    <CCard className="bg-white">
                      <CCardBody>
                        <h6 className="border-bottom pb-2 mb-4 d-flex align-items-center justify-content-between">
                          <span>Tree Information</span>
                        </h6>
                        <CRow>
                          <CCol className="col-6 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                ID:
                              </CFormLabel>
                              {requestDetailData.request?._id}
                            </div>
                          </CCol>
                          <CCol className="col-6 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                Signer:
                              </CFormLabel>
                              {requestDetailData.user?.firstName +
                                ' ' +
                                requestDetailData?.user.lastName}
                              <a
                                href={`#/users/${requestDetailData.user._id}`}
                                className="text-primary"
                              >
                                ({ellipsisString(requestDetailData.request.signer, 5)})
                              </a>
                            </div>
                          </CCol>
                          <CCol className="col-6 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                Birth Date:
                              </CFormLabel>
                              {moment(requestDetailData.request?.birthDate).format(
                                'MMMM DD YYYY - hh:mm a',
                              )}
                            </div>
                          </CCol>
                          <CCol className="col-6 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                Updated At:
                              </CFormLabel>
                              {moment(requestDetailData.request?.updatedAt).format(
                                'MMMM DD YYYY - hh:mm a',
                              )}
                            </div>
                          </CCol>
                          <CCol className="col-12 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                Tree Specs:
                              </CFormLabel>
                              {requestDetailData.request?.treeSpecs}
                            </div>
                          </CCol>
                          <CCol className="col-6 mb-1">
                            <div className="d-flex align-items-start">
                              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                                Nursery:
                              </CFormLabel>
                              {JSON.parse(requestDetailData.request?.treeSpecsJSON).nursery
                                ? 'YES'
                                : 'NO'}
                            </div>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol className="col-6">
                    <CCard className="bg-white">
                      <CCardBody>
                        <h6 className="border-bottom pb-2 mb-4">Location</h6>
                        <img
                          src={createMapUrl(
                            JSON.parse(requestDetailData.request?.treeSpecsJSON)?.location
                              .latitude / Math.pow(10, 6),
                            JSON.parse(requestDetailData.request?.treeSpecsJSON)?.location
                              .longitude / Math.pow(10, 6),
                          )}
                          alt="app"
                          className="img-fluid w-100"
                        />
                      </CCardBody>
                    </CCard>
                  </CCol>
                  {JSON.parse(requestDetailData.request?.treeSpecsJSON)?.updates &&
                    JSON.parse(requestDetailData.request?.treeSpecsJSON)?.updates.length > 0 && (
                      <CCol className="col-6">
                        <CCard className="bg-white">
                          <CCardBody>
                            {JSON.parse(requestDetailData.request?.treeSpecsJSON)?.updates.map(
                              (update, index) => (
                                <div key={'div' + index}>
                                  <>
                                    <h6 className="border-bottom pb-2 mb-4">
                                      Update:
                                      {moment(Number(update.created_at * 1000)).format(
                                        'MM/DD/YYYY - hh:mm a',
                                      )}
                                    </h6>
                                    <img
                                      src={update.image}
                                      alt={update.created_at}
                                      className="w-100"
                                    />
                                  </>
                                </div>
                              ),
                            )}
                          </CCardBody>
                        </CCard>
                      </CCol>
                    )}
                </CRow>
              </CCol>
            </CRow>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default PlantDetails
