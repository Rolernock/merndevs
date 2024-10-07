import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <Container>
      <Row className='mt-5'>
        <Col className='text-center'>
          <Link className='text-decoration-none my-2' to='/message'>
            Contact Developer
          </Link>
          <p>mernDevs &copy; {currentYear}</p>
        </Col>
      </Row>
    </Container>
  )
}
