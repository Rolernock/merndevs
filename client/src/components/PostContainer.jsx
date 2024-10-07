import { Row, Col } from 'react-bootstrap'

export default function PostCointainer({ children }) {
  return (
    <Row className='justify-content-center'>
      <Col xs={12} md={8}>
        {children}
      </Col>
    </Row>
  )
}
