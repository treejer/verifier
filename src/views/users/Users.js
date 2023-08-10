import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch } from '@coreui/icons'
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
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'

import { Pagination } from '../../components/common/'

const Users = () => {
  const { dispatchGetUsers, usersData, userLoading } = useGetUsers()
  const { userSign } = useUserSign()
  const token = userSign?.access_token
  const [param, setParam] = useState({ skip: 0, limit: 20, filters: null })
  const userList = token ? usersData?.data : []
  const totalPage = token ? Math.ceil(usersData?.count / param.limit) : 0
  const handlePageChange = (newPage) => {
    setParam((prevParam) => ({
      ...prevParam,
      skip: newPage - 1,
    }))
  }

  const handleChange = (event) => {
    if (event.target.value !== '') {
      setParam((prevParam) => ({
        ...prevParam,
        filters: event.target.value,
      }))
    }
  }

  useEffect(() => {
    if (token) {
      dispatchGetUsers(param)
    }
  }, [dispatchGetUsers, token])

  useEffect(() => {
    dispatchGetUsers(param)
  }, [param])

  return (
    <>
      <CInputGroup className="mb-3">
        <CFormInput
          onChange={handleChange}
          aria-describedby="basic-addon3"
          placeholder="Search by name or walletaddress"
        />
        <CInputGroupText id="basic-addon3">
          <CIcon icon={cilSearch} height={14} />
        </CInputGroupText>
      </CInputGroup>
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
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Wallet</CTableHeaderCell>
                <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
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
                      <CTableDataCell>{user.createdAt}</CTableDataCell>
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
          {totalPage > 0 && (
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
