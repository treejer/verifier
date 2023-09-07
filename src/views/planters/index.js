import React, { useEffect, useState } from 'react'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
// import debounce from 'lodash.debounce'
// import { toast } from 'react-toastify'
import { cilPencil } from '@coreui/icons'
import { useGetPlanters } from '../../redux/modules/planters'
import { useUserSign } from '../../redux/modules/userSign'
import {
  CCard,
  CBadge,
  CCardLink,
  CFormInput,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import Skeleton from 'react-loading-skeleton'
// import { Pagination } from '../../components/common'
import 'react-loading-skeleton/dist/skeleton.css'

const Planters = () => {
  const [activeTab, setActiveTab] = useState('Plant')
  const { dispatchGetPlanters, plantersData, planterLoading } = useGetPlanters()
  const { userSign } = useUserSign()
  const token = userSign?.access_token
  // const [param, setParam] = useState({
  //   skip: 0,
  //   limit: 20,
  //   filters: {},
  //   sort: { createdAt: 1 },
  // })
  // const userList = token ? usersData?.data : []
  // const totalPage = token ? Math.ceil(usersData?.count / param.limit) : 0
  // const handlePageChange = (newPage) => {
  //   setParam((prevParam) => ({
  //     ...prevParam,
  //     skip: newPage - 1,
  //   }))
  // }

  // const handleSort = () => {
  //   if (userList.length > 0) {
  //     setSort(!sort)
  //     setParam((prevParam) => ({
  //       ...prevParam,
  //       sort: {
  //         createdAt: sort ? 1 : -1,
  //       },
  //     }))
  //   }
  // }

  // const debouncedSetParam = debounce((newParam) => {
  //   setParam(newParam)
  // }, 1000)

  // const handleChange = (event) => {
  //   const filterKey = event.target.name
  //   let filterValue = event.target.value

  //   if (filterKey === 'userStatus') {
  //     filterValue = filterValue === 'Status' ? null : Number(filterValue)
  //   }

  //   debouncedSetParam((prevParam) => {
  //     const { filters, ...restParam } = prevParam
  //     const updatedFilters = { ...filters }

  //     if (filterValue !== '' && filterValue !== null) {
  //       updatedFilters[filterKey] = filterValue
  //     } else {
  //       delete updatedFilters[filterKey]
  //     }

  //     return {
  //       ...restParam,
  //       filters: updatedFilters,
  //       skip: 0,
  //     }
  //   })
  // }

  useEffect(() => {
    console.log('plantersss', plantersData)
    if (token) {
      dispatchGetPlanters(activeTab)
    } else {
      // toast.error('Request failed with status code 401')
    }
  }, [dispatchGetPlanters, token, activeTab])

  return (
    <>
      <CRow className="mb-3">
        <CCol className="col-12">
          <CNav>
            <CNavItem>
              <CNavLink
                className="cursor-pointer"
                onClick={() => setActiveTab('Plant')}
                active={activeTab === 'Plant' ? true : false}
              >
                Plant
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                className="cursor-pointer"
                onClick={() => setActiveTab('Assigned')}
                active={activeTab === 'Assigned' ? true : false}
              >
                Assigned
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                className="cursor-pointer"
                onClick={() => setActiveTab('Update')}
                active={activeTab === 'Update' ? true : false}
              >
                Update
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            {activeTab}
          </h4>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-15">
                  ID
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Signer</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  TreeSpec
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Show detail</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {!planterLoading && (
              <CTableBody>
                {plantersData &&
                  plantersData.map((planter, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{planter._id}</CTableDataCell>
                      <CTableDataCell>{planter.signer}</CTableDataCell>
                      <CTableDataCell>{planter.treeSpecs}</CTableDataCell>
                      <CTableDataCell>
                        {moment(planter.createdAt).format('YYYY-MM-DD - hh:mm a')}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={planter.status > 0 ? 'success' : 'warning'}
                          className="text-white"
                        >
                          {planter.status > 0 ? 'active' : 'pending'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CCardLink
                          href={`/#/planters/p&${planter._id}`}
                          className="text-decoration-none"
                        >
                          <CIcon icon={cilPencil} height={14} className="pe-1" />
                        </CCardLink>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            )}
          </CTable>
          {planterLoading && (
            <Skeleton count={10} height={45} className="w-100 mb-2" containerClassName="w-100" />
          )}

          {/* {(totalPage > 0 || (userList && userList.length > 0)) && (
            <>
              <Pagination
                currentPage={param.skip + 1}
                totalPages={totalPage}
                onPageChange={handlePageChange}
              />
            </>
          )} */}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Planters
