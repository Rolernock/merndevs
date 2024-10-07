import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ({ pages, keyword }) {
  return (
    pages > 1 && (
      <Pagination size='sm'>
        {[...Array(pages).keys()].map(pg => (
          <Pagination.Item
            linkClassName='btn-color'
            key={pg + 1}
            as={Link}
            to={keyword ? `/search/${keyword}` : `/page/${pg + 1}`}
          >
            {pg + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  )
}
