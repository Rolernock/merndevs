import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <>
      <Header />
      <Container className='mt-3'>
        <Outlet />
        <Footer />
      </Container>
    </>
  )
}
