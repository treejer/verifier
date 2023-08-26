import React, { useEffect, useState } from 'react'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'
import { cilPencil, cilCaretTop, cilCaretBottom } from '@coreui/icons'
import { useGetUsers } from '../../redux/modules/users'
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
} from '@coreui/react'
import Skeleton from 'react-loading-skeleton'
import { Pagination } from '../../components/common'
import 'react-loading-skeleton/dist/skeleton.css'

const Users = () => {
  const [sort, setSort] = useState(false)
  const { dispatchGetUsers, usersData, userLoading } = useGetUsers()
  const { userSign } = useUserSign()
  const token = userSign?.access_token
  const [param, setParam] = useState({
    skip: 0,
    limit: 20,
    filters: {},
    sort: { createdAt: 1 },
  })
  const userList = token ? usersData?.data : []
  const totalPage = token ? Math.ceil(usersData?.count / param.limit) : 0
  const handlePageChange = (newPage) => {
    setParam((prevParam) => ({
      ...prevParam,
      skip: newPage - 1,
    }))
  }

  const handleSort = () => {
    if (userList.length > 0) {
      setSort(!sort)
      setParam((prevParam) => ({
        ...prevParam,
        sort: {
          createdAt: sort ? 1 : -1,
        },
      }))
    }
  }

  const debouncedSetParam = debounce((newParam) => {
    setParam(newParam)
  }, 1000)

  const handleChange = (event) => {
    const filterKey = event.target.name
    let filterValue = event.target.value

    if (filterKey === 'userStatus') {
      filterValue = filterValue === 'Status' ? null : Number(filterValue)
    }

    debouncedSetParam((prevParam) => {
      const { filters, ...restParam } = prevParam
      const updatedFilters = { ...filters }

      if (filterValue !== '' && filterValue !== null) {
        updatedFilters[filterKey] = filterValue
      } else {
        delete updatedFilters[filterKey]
      }

      return {
        ...restParam,
        filters: updatedFilters,
        skip: 0,
      }
    })
  }

  useEffect(() => {
    if (token) {
      dispatchGetUsers(param)
    } else {
      toast.error('Request failed with status code 401')
    }
  }, [dispatchGetUsers, token])

  return (
    <>
      <CRow className="mb-3">
        <CCol className="col-4">
          <CFormInput
            name="firstName"
            onChange={handleChange}
            aria-describedby="basic-addon3"
            placeholder="Search by name"
          />
        </CCol>
        <CCol className="col-4">
          <CFormInput
            name="walletAddress"
            onChange={handleChange}
            aria-describedby="basic-addon3"
            placeholder="Search by walletaddress"
          />
        </CCol>
        <CCol className="col-4">
          <CFormSelect name="userStatus" onChange={handleChange}>
            <option>Status</option>
            <option value="1">Active</option>
            <option value="0">In Progress</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            Users
          </h4>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  ID
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  Wallet
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">
                  Created At
                  <div onClick={handleSort} className="d-inline-flex ps-1">
                    {sort ? (
                      <CIcon icon={cilCaretTop} height={8} />
                    ) : (
                      <CIcon icon={cilCaretBottom} height={8} />
                    )}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Show detail</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {!userLoading && (
              <CTableBody>
                {userList &&
                  userList.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{param.limit * param.skip + (index + 1)}</CTableDataCell>
                      <CTableDataCell>{user._id}</CTableDataCell>
                      <CTableDataCell>
                        {user.firstName} {user.lastName}
                      </CTableDataCell>
                      <CTableDataCell>{user.walletAddress}</CTableDataCell>
                      <CTableDataCell>
                        {moment(user.createdAt).format('MMMM DD YYYY - hh:mm a')}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge
                          color={user.userStatus > 0 ? 'success' : 'warning'}
                          className="text-white"
                        >
                          {user.userStatus > 0 ? 'active' : 'pending'}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CCardLink href={`/#/users/${user._id}`} className="text-decoration-none">
                          <CIcon icon={cilPencil} height={14} className="pe-1" />
                        </CCardLink>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            )}
          </CTable>
          {userLoading && (
            <Skeleton count={14} height={25} className="w-100 mb-2" containerClassName="w-100" />
          )}

          {(totalPage > 0 || (userList && userList.length > 0)) && (
            <>
              <Pagination
                currentPage={param.skip + 1}
                totalPages={totalPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Users
