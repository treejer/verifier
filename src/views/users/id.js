import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'
import { useParams } from 'react-router-dom'
import useContract from '../../utilities/hooks/useContract'
import {
  CModal,
  CSpinner,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CCardLink,
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CFormLabel,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import ChangeStatusModal from './changeStatusModal'
import { useGetUserDetail } from '../../redux/modules/userDetail'
import { useUserSign } from '../../redux/modules/userSign'
import { useWeb3 } from '../../redux/modules/web3/slice'
import { useGetPatch } from '../../redux/modules/userPatch'
import contryCodes from '../../utilities/contryCodes.json'
import { toast } from 'react-toastify'

const UserDetailsForm = () => {
  const {
    roleGranted,
    contractResponse,
    checkAdminRole,
    handleJoinPlanter,
    handleGrantHighLevel,
    handleJoinPlanterWithSafe,
    checkPlanterRoleGranted,
    handleGrantPlanterRole,
  } = useContract()
  const { web3 } = useWeb3()
  const { userPatchData, error: errorPatch } = useGetPatch()
  const { id } = useParams()
  const { userSign } = useUserSign()
  const [visible, setVisible] = useState(false)
  const [signRoleModalVisible, setSingRoleModalVisible] = useState(false)
  const [dataModalVisible, setDataModalVisible] = useState(false)
  const { dispatchGetUserDetail, userDetailData } = useGetUserDetail()
  const { dispatchGetPatch } = useGetPatch()
  const token = userSign?.access_token
  const [userFlag, setUserFlag] = useState(false)
  const [onchainFlag, setOnchainFlag] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [loadingRejectBtn, setLoadingRejectBtn] = useState(false)
  const [sampleData, setSampleData] = useState(null)
  const [highLevel, setHighLevel] = useState(null)
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
  const LoggedUserAddress = userSign.address
  const avatarUrl = `${process.env.REACT_APP_AVATAR_URL}${userDetails.user.walletAddress}`

  useEffect(() => {
    if (token && !userFlag) {
      dispatchGetUserDetail(id)
      setUserFlag(true)
      checkAdminRole(LoggedUserAddress)
    }
    if (token && userDetailData && userFlag) {
      setDetail(userDetailData)
      setSampleData(userDetailData)
      checkPlanterRoleGranted(userDetailData.user?.walletAddress)
    }

    setLoadingRejectBtn(false)
    setLoadingBtn(false)
    if (errorPatch && userFlag) {
      toast.error(errorPatch.message)
    } else if (userPatchData && !errorPatch) {
      toast.success('User Data Successfully changed.')
    }

    if (contractResponse && userFlag) {
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

    return () => {
      if (userFlag) {
        setUserFlag(false)
        dispatchGetPatch(null, 'reset')
      }
    }
  }, [token, userDetailData, userPatchData, errorPatch, contractResponse])

  const handlePatchUserAction = (id, action) => {
    if (action === 'reject') {
      setLoadingRejectBtn(true)
    } else if (action === 'verify') {
      setLoadingBtn(true)
    }
    dispatchGetPatch(id, action)
    setVisible(false)
  }

  const handleGrantAction = (address) => {
    handleGrantPlanterRole(address)
  }

  const showDataModal = (action) => {
    if (action === 'onchain') {
      setOnchainFlag(!onchainFlag)
    } else if (action === 'close') {
      setOnchainFlag(false)
    }
    setDataModalVisible(!dataModalVisible)
  }

  const hanldeJoinPlanterAction = () => {
    if (dataModalVisible) {
      setLoadingBtn(false)
      if (sampleData.application?.type) {
        if (
          sampleData.application?.type === 3 &&
          (sampleData.application?.organizationAddress === process.env.REACT_APP_ZERO_ADDRESS ||
            sampleData.application.organizationAddress === '')
        ) {
          toast.error('Please select organization')
          return
        }
      }

      if (!sampleData.application?.latitude || !sampleData.application?.longitude) {
        toast.error('Please select location longitude and latitude')
        return
      }
    }
    if (web3.config.multiSign === 'false') {
      setLoadingBtn(true)
      handleJoinPlanter(sampleData)
    } else {
      setLoadingBtn(true)
      handleJoinPlanterWithSafe(sampleData)
    }
  }

  const handleFormChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    const [objectName, propertyName] = name.split('.')
    setSampleData((prevSampleData) => ({
      ...prevSampleData,
      [objectName]: {
        ...prevSampleData[objectName],
        [propertyName]: value,
      },
    }))
  }

  const handleHighLevel = (event) => {
    setHighLevel(event.target.value)
  }

  const grantHighLevelRole = () => {
    setLoadingBtn(true)
    handleGrantHighLevel(highLevel, userDetails.user?.walletAddress)
  }

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
              {avatarUrl && <CAvatar size="xl" src={avatarUrl} className="mt-5 mb-5" />}

              <CCol className="mt-5 d-flex flex-column align-items-center">
                {web3.config && web3.config.multiSign === 'false' && !roleGranted && (
                  <CButton
                    color="primary"
                    variant="outline"
                    className="d-flex mb-2 w-75 justify-content-center"
                    onClick={() =>
                      userDetails.user.walletAddress &&
                      handleGrantAction(userDetailData.user.walletAddress)
                    }
                  >
                    Grant Planter Role
                  </CButton>
                )}

                {web3.config && web3.config.multiSign === 'false' && (
                  <CButton
                    className="d-flex mb-2 w-75 justify-content-center"
                    color="primary"
                    variant="outline"
                    onClick={() => showDataModal('onchain')}
                  >
                    Join Planter
                  </CButton>
                )}

                {web3.config && web3.config.multiSign === 'true' && (
                  <CButton
                    className="d-flex mb-2 w-75 justify-content-center"
                    color="primary"
                    variant="outline"
                    onClick={() => showDataModal('')}
                  >
                    Join Planter
                  </CButton>
                )}

                <CButton
                  color="primary"
                  variant="outline"
                  className="d-flex mb-2 w-75 justify-content-center"
                  onClick={() => setVisible(!visible)}
                >
                  Verify Offchain
                </CButton>

                <CButton
                  color="primary"
                  variant="outline"
                  className="d-flex mb-2 w-75 justify-content-center"
                  onClick={() => setSingRoleModalVisible(!visible)}
                >
                  Assign Role
                </CButton>
              </CCol>
            </CCol>
            <CCol className="col-9 mb-0">
              <CRow>
                <CCol className="col-12 mb-2">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4 d-flex align-items-center justify-content-between">
                        <span>Personal Information</span>
                      </h6>
                      <CRow>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              First Name:
                            </CFormLabel>
                            {userDetails.user.firstName || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Last Name:
                            </CFormLabel>
                            {userDetails.user.lastName || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Public Address:
                            </CFormLabel>
                            {userDetails.user.walletAddress || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                            Created At:
                          </CFormLabel>
                          {userDetails.user.createdAt || ''}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Email:
                            </CFormLabel>
                            {userDetails.user.email}
                          </div>
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
                              name="user.isAdmin"
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
                              name="user.isVerified"
                              className="form-check-input"
                              type="checkbox"
                              value={userDetails.user.isVerified}
                              disabled
                            />
                          )}
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Mobile:
                            </CFormLabel>
                            {userDetails.user.mobile || ''}
                          </div>
                        </CCol>
                        <CCol className="col-6 mb-1">
                          <div className="d-flex align-items-start justify-items-center">
                            <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                              Mobile Code:
                            </CFormLabel>
                            {userDetails.user.mobileCountry || ''}
                          </div>
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
                          className="img-fluid w-100"
                        />
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol className="col-6">
                  <CCard className="bg-white">
                    <CCardBody>
                      <h6 className="border-bottom pb-2 mb-4 d-flex align-items-center justify-content-between">
                        <span>Application Info</span>
                      </h6>
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

      <ChangeStatusModal
        visible={visible}
        rejectLoading={loadingRejectBtn}
        verifyLoading={loadingBtn}
        onClose={() => setVisible(false)}
        onReject={() =>
          userDetails.user._id && handlePatchUserAction(userDetails.user._id, 'reject')
        }
        onVerify={() =>
          userDetails.user._id && handlePatchUserAction(userDetails.user._id, 'verify')
        }
      />

      <CModal
        backdrop="static"
        visible={signRoleModalVisible}
        onClose={() => setSingRoleModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Grant High Level roles</CModalTitle>
        </CModalHeader>
        <CModalBody className="fs-5 fw-bold">
          <CFormSelect name="highlevel" className="w-100" size="sm" onChange={handleHighLevel}>
            <option>Select role</option>
            <option value="verifier">Verifier</option>
            <option value="datamanager">Data Manager</option>
            <option value="admin">Admin</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CRow className="w-100">
            <CCol xs={9}>
              <CButton color="secondary" onClick={() => setSingRoleModalVisible(false)}>
                Cancel
              </CButton>
            </CCol>
            <CCol xs={3}>
              <CButton
                className="text-white w-100"
                color="primary"
                onClick={() => highLevel && grantHighLevelRole()}
                disabled={loadingBtn}
              >
                {loadingBtn && (
                  <CSpinner
                    component="span"
                    size="sm"
                    variant="grow"
                    aria-hidden="true"
                    className="me-2"
                  />
                )}
                Save
              </CButton>
            </CCol>
          </CRow>
        </CModalFooter>
      </CModal>

      <CModal backdrop="static" visible={dataModalVisible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>User Detail</CModalTitle>
        </CModalHeader>
        <CModalBody className="fs-5 fw-bold">
          <CRow>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">First Name:</CFormLabel>
              <CFormInput
                name="user.firstName"
                className="w-100"
                type="text"
                defaultValue={userDetails.user.firstName || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Last Name:</CFormLabel>
              <CFormInput
                name="user.lastName"
                className="w-100"
                type="text"
                defaultValue={userDetails.user.lastName || ''}
                onChange={handleFormChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol className="col-12 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                Public Address:
              </CFormLabel>
              <CFormInput
                name="user.walletAddress"
                className="w-100"
                type="text"
                defaultValue={userDetails.user.walletAddress || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Email:</CFormLabel>
              <CFormInput
                name="user.email"
                className="w-100"
                type="text"
                defaultValue={userDetails.user.email || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Mobile:</CFormLabel>
              <CFormInput
                name="user.mobile"
                className="w-100"
                type="text"
                defaultValue={userDetails.user.mobile || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Mobile Code:</CFormLabel>
              <CFormSelect
                name="user.mobileCountry"
                className="w-100"
                size="sm"
                value={userDetails.user.mobileCountry || ''}
                onChange={handleFormChange}
              >
                <option>Select Country Code</option>
                {contryCodes &&
                  contryCodes.map((item, index) => (
                    <option value={item.alpha2} key={index}>
                      {item.alpha2} - {item.name}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Referrer:</CFormLabel>
              <CFormInput
                name="application.Referrer"
                className="w-100"
                type="text"
                defaultValue={userDetails.application?.Referrer || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Latitude:</CFormLabel>
              <CFormInput
                name="application.latitude"
                className="w-100"
                type="text"
                defaultValue={userDetails.application?.latitude || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Longitude:</CFormLabel>
              <CFormInput
                name="application.longitude"
                className="w-100"
                type="text"
                defaultValue={userDetails.application?.longitude || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">
                Organization Address:
              </CFormLabel>
              <CFormInput
                name="application.organizationAddress"
                className="w-100"
                type="text"
                defaultValue={userDetails.application?.organizationAddress || ''}
                onChange={handleFormChange}
              />
            </CCol>
            <CCol className="col-6 mb-2 text-start">
              <CFormLabel className="pe-2 fs-6 fst-normal text-black-50">Type:</CFormLabel>
              <CFormSelect
                name="application.type"
                className="w-100"
                size="sm"
                defaultValue={userDetails.application?.type || ''}
                onChange={handleFormChange}
              >
                <option>Member of Organization</option>
                <option value="1">Planter</option>
                <option value="2">Organization</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CRow className="w-100">
            <CCol xs={3}>
              <CButton color="secondary" onClick={() => showDataModal('close')}>
                Cancel
              </CButton>
            </CCol>
            <CCol xs={9} className="d-flex align-items-end justify-content-end m-0">
              {!onchainFlag && (
                <CButton
                  className="text-white"
                  color="primary"
                  onClick={() => userDetails.user.walletAddress && hanldeJoinPlanterAction()}
                  disabled={loadingBtn}
                >
                  {loadingBtn && (
                    <CSpinner
                      component="span"
                      size="sm"
                      variant="grow"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  Save & Accept Join Planter
                </CButton>
              )}
              {onchainFlag && (
                <CButton
                  className="text-white"
                  color="primary"
                  onClick={() => userDetails.user.walletAddress && hanldeJoinPlanterAction()}
                  disabled={loadingBtn}
                >
                  {loadingBtn && (
                    <CSpinner
                      component="span"
                      size="sm"
                      variant="grow"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  Save & Accept Join onchain
                </CButton>
              )}
            </CCol>
          </CRow>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserDetailsForm
