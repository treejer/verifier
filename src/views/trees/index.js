import React, { useEffect, useState } from 'react'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'
import { cilPencil, cilCaretTop, cilCaretBottom } from '@coreui/icons'
import { useGetTrees } from '../../redux/modules/trees'
import { useUserSign } from '../../redux/modules/userSign'
import {
  CCard,
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
  CRow,
  CCol,
} from '@coreui/react'
import Skeleton from 'react-loading-skeleton'
import { Pagination } from '../../components/common'
import 'react-loading-skeleton/dist/skeleton.css'

const Trees = () => {
  const [sort, setSort] = useState(false)
  const { dispatchGetTrees, treesData, treeLoading } = useGetTrees()
  const { userSign } = useUserSign()
  const token = userSign?.access_token
  const [param, setParam] = useState({
    skip: 0,
    currentPage: 1,
    limit: 20,
    query: {
      planter: '',
      id: '',
    },
    sort: { createdAt: 1 },
  })
  const treesList = token ? treesData : []
  const totalPage = token ? Math.ceil(treesData?.length / param.limit) : 0
  const handlePageChange = (newPage) => {
    setParam((prevParam) => ({
      ...prevParam,
      skip: newPage - 1,
    }))
  }

  const handleSort = () => {
    if (treesList.length > 0) {
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
    dispatchGetTrees(param)
  }, 1300)

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    const [objectName, propertyName] = name.split('.')
    debouncedSetParam((prevSampleData) => ({
      ...prevSampleData,
      [objectName]: {
        ...prevSampleData[objectName],
        [propertyName]: value,
      },
    }))
  }

  useEffect(() => {
    if (token) {
      dispatchGetTrees(param)
    } else {
      toast.error('Request failed with status code 401')
    }
    // if (param) {
    //   dispatchGetTrees(param)
    // }
  }, [dispatchGetTrees, token, param])

  return (
    <>
      <CRow className="mb-3">
        <CCol className="col-4">
          <CFormInput
            name="query.planter"
            onChange={handleChange}
            aria-describedby="basic-addon3"
            placeholder="Search By Planter Address"
          />
        </CCol>
        <CCol className="col-4">
          <CFormInput
            name="query.id"
            onChange={handleChange}
            aria-describedby="basic-addon3"
            placeholder="Search By Tree ID"
          />
        </CCol>
      </CRow>
      <CCard className="mb-4">
        <CCardHeader>
          <h4 id="traffic" className="card-title mb-0">
            Trees
          </h4>
        </CCardHeader>
        <CCardBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">PLANTER</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  Tree Specs Entity
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" className="w-25">
                  Last Update At
                  <div onClick={handleSort} className="d-inline-flex ps-1">
                    {sort ? (
                      <CIcon icon={cilCaretTop} height={8} />
                    ) : (
                      <CIcon icon={cilCaretBottom} height={8} />
                    )}
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                <CTableHeaderCell scope="col">Show detail</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {!treeLoading && (
              <CTableBody>
                {treesList &&
                  treesList.map((tree, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{param.limit * param.skip + (index + 1)}</CTableDataCell>
                      <CTableDataCell> {tree.id}</CTableDataCell>
                      <CTableDataCell>{tree.Planter}</CTableDataCell>
                      <CTableDataCell>{tree.TreeSpecsEntity}</CTableDataCell>
                      <CTableDataCell>
                        {moment(tree.CreatedAt).format('MMMM DD YYYY - hh:mm a')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(tree.LastUpdateAt).format('MMMM DD YYYY - hh:mm a')}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CCardLink
                          href={`/#/trees/${tree.showDetail}`}
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
          {treeLoading && (
            <Skeleton count={14} height={25} className="w-100 mb-2" containerClassName="w-100" />
          )}

          {(totalPage > 0 || (treesList && treesList.length > 0)) && (
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

export default Trees
