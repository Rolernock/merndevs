import { Col, Row, Image, Button, Container } from 'react-bootstrap'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export default function LandingScreen() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.users)
  useEffect(() => {
    if (user) {
      return navigate('/posts')
    }
  }, [user])
  return (
    <div className='bg-dark f-page d-flex align-items-center'>
      <Container>
        <Row>
          <Col xs={12} md={5}>
            <Image src='/home.svg' fluid />
          </Col>
          <Col
            xs={12}
            md={7}
            className='light-text light-text d-flex flex-column align-items-center justify-content-center'
          >
            <h1>mernDevs</h1>
            <p className='text-large'>
              Find like minded developers to work on exciting projects.
            </p>
            <section className='d-flex gap-2'>
              <Button as={Link} to='/login' className='light-btn'>
                Login
              </Button>
              <Button as={Link} to='/register' className='light-btn'>
                Register
              </Button>
            </section>
            <Button as={Link} to='/posts' className='mt-3 light-btn'>
              View Posts
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
