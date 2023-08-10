import React from 'react'
import PropTypes from 'prop-types'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <CPagination aria-label="Page navigation example">
      <CPaginationItem disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </CPaginationItem>
      {pageNumbers.map((pageNumber) => (
        <CPaginationItem
          key={pageNumber}
          active={pageNumber === currentPage}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </CPaginationItem>
      ))}
      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default React.memo(Pagination)
