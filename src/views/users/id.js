import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import {
  CCardLink,
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import { useGetUserDetail } from '../../redux/modules/userDetail'
import { useUserSign } from '../../redux/modules/userSign'
import { useWeb3 } from '../../redux/modules/web3/slice'

const UserDetailsForm = () => {
  const { web3 } = useWeb3()
  const { id } = useParams()
  const { userSign } = useUserSign()
  const { dispatchGetUserDetail, userDetailData } = useGetUserDetail()
  const token = userSign?.access_token
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
    if (token) {
      dispatchGetUserDetail(id)
    }
    if (token && userDetailData) {
      setDetail(userDetailData)
    }
  }, [dispatchGetUserDetail, token])

  return (
    <>
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
              {avatarUrl && <CAvatar size="xl" src={avatarUrl} className="mt-5" />}
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
                          src={`http://maps.google.com/maps/api/staticmap?
                          center=${userDetails.application.latitude},${userDetails.application.longitude}&zoom=15&size=640x580&scale=2&maptype=terrain&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`}
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
    </>
  )
}

export default UserDetailsForm
