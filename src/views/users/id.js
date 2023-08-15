import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import {
  CToast,
  CToastBody,
  CToastClose,
  CCardLink,
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { useGetUserDetail } from '../../redux/modules/userDetail'
import { useUserSign } from '../../redux/modules/userSign'
import { useWeb3 } from '../../redux/modules/web3/slice'
import { usePatchData } from '../../redux/modules/userPatch'

const UserDetailsForm = () => {
  const { web3 } = useWeb3()
  const { patchData } = usePatchData()
  const { id } = useParams()
  const { userSign } = useUserSign()
  const [visible, setVisible] = useState(false)
  const { dispatchGetUserDetail, dispatchPatchUser, userDetailData } = useGetUserDetail()
  const token = userSign?.access_token
  const [userFlag, setUserFlag] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: null, type: 'danger' })
  const [userDetails, setDetail] = useState({
    user: {
      id: null,
      firstName: null,
      lastName: null,
      walletAddress: null,
      createdAt: null,
      email: null,
      emailToken: null,
      emailVerifiedAt: null,
      isAdmin: 0,
      isVerified: 0,
      lastLoginAt: null,
      mobile: null,
      mobileCountry: null,
      mobileCodeRequestedAt: null,
      mobileCodeRequestsCountForToday: null,
      mobileVerifiedAt: null,
      signedAt: null,
    },
    file: null,
    imgSrcAdmin: null,
    application: null,
  })
  const avatarUrl = `${process.env.REACT_APP_AVATAR_URL}${userDetails.user.walletAddress}`
  useEffect(() => {
    if (token && !userFlag) {
      dispatchGetUserDetail(id)
      setUserFlag(!userFlag)
    }
    if (token && userDetailData) {
      setDetail(userDetailData)
    }
    if (patchData.error && userFlag) {
      setToast({
        visible: true,
        message: patchData.error.message,
        type: 'danger',
      })
    }
  }, [dispatchGetUserDetail, token, userDetailData, patchData])

  const handlePatchUserAction = (id, action) => {
    dispatchPatchUser(id, action)
    setVisible(false)
  }

  return (
    <>
      <CToast
        autohide={false}
        visible={toast.visible}
        color={toast.type}
        className="text-white position-absolute top-0 mt-5 end-0 translate-middle-x"
      >
        <div className="d-flex">
          <CToastBody>{toast.message}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
      <CCardLink href="#/users" className="d-flex align-items-center mb-2 text-decoration-none">
        <CIcon icon={cilChevronLeft} height={14} className="pe-1" />
        Back
      </CCardLink>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            User Detail
          </h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol className="col-3 mb-5 text-center">
              {avatarUrl && <CAvatar size="xl" src={avatarUrl} className="mt-5 mb-5" />}
              <CCol className="mt-5">
                <CButton color="primary" variant="outline" onClick={() => setVisible(!visible)}>
                  {/* {userDetails.user.isVerified ? 'Active' : 'Deactive'} */}
                  Active
                </CButton>
              </CCol>
            </CCol>
            <CCol className="col-9 mb-0">
              <CRow>
                <CCol className="col-12 mb-2">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4">Personal Information</h6>
                      <CRow>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            First Name:
                          </CFormLabel>
                          {userDetails.user.firstName || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Last Name:
                          </CFormLabel>
                          {userDetails.user.lastName || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Public Address:
                          </CFormLabel>
                          {userDetails.user.walletAddress || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Created At:
                          </CFormLabel>
                          {userDetails.user.createdAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Email:
                          </CFormLabel>
                          {userDetails.user.email || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Email Token:
                          </CFormLabel>
                          {userDetails.user.emailToken || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Email Verified At:
                          </CFormLabel>
                          {userDetails.user.emailVerifiedAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Is Admin:
                          </CFormLabel>
                          {userDetails.user && (
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={userDetails.user.isAdmin}
                              disabled
                            />
                          )}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Is Verified:
                          </CFormLabel>
                          {userDetails.user.isVerified ? 'true' : 'false'}
                          {userDetails.user && (
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={userDetails.user.isVerified}
                              disabled
                            />
                          )}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Mobile:
                          </CFormLabel>
                          {userDetails.user.mobile || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Mobile Code:
                          </CFormLabel>
                          {userDetails.user.mobileCountry || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Mobile Code Requested At:
                          </CFormLabel>
                          {userDetails.user.mobileCodeRequestedAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Mobile Code Requests Count For Today:
                          </CFormLabel>
                          {userDetails.user.mobileCodeRequestsCountForToday || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Signed At:
                          </CFormLabel>
                          {userDetails.user.signedAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Last Login At:
                          </CFormLabel>
                          {userDetails.user.lastLoginAt || ''}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="col-6">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4">File Info</h6>
                      {userDetails.file && (
                        <img
                          src={`${web3?.config?.base_url}/files/${userDetails.file?.filename}`}
                          alt={userDetails.file.filename}
                          className="img-fluid"
                        />
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="col-6">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4">Application Info</h6>
                      {userDetails.application && (
                        <img
                          src={`http://maps.google.com/maps/api/staticmap?center=${userDetails.application.latitude},${userDetails.application.longitude}&zoom=15&size=340x280&scale=2&maptype=terrain&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`}
                          alt="app"
                          className="img-fluid"
                        />
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CModalBody className="fs-5 fw-bold">
          {userDetails.user.isVerified
            ? 'Do you really want to change status?'
            : 'Do You really want to reject user?'}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          {!userDetails.user.isVerified && (
            <CButton
              className="text-white"
              color="primary"
              onClick={() =>
                userDetails.user._id && handlePatchUserAction(userDetails.user._id, 'verify')
              }
            >
              Confirm
            </CButton>
          )}

          {/* {!userDetails.user.isVerified && (
            <CButton
              className="text-white"
              color="primary"
              onClick={() =>
                userDetails.user._id && handlePatchUserAction(userDetails.user._id, 'reject')
              }
            >
              Confirm
            </CButton>
          )} */}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserDetailsForm
