import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Image,
  Dropdown
} from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../slices/userSlice'

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.users)
  const logOutHandler = async () => {
    await dispatch(logOut())
    navigate('/login')
  }

  const firstName = username => {
    return username.split(' ')[0]
  }
  return (
    <header>
      <Navbar variant='dark' expand='md' className='dark-bg'>
        <Container>
          <Navbar.Brand className='my-0' as={Link} to='/'>
            <Image src='/merndevs.svg' />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='ms-auto light-text'>
              {user ? (
                <div className='d-flex gap-2'>
                  <Nav.Link as={Link} to='/posts'>
                    Posts
                  </Nav.Link>
                  <Nav.Link as={Link} to='/developers'>
                    Developers
                  </Nav.Link>
                  <Nav.Link as={Link} to='/profile'>
                    Profile
                  </Nav.Link>
                  <NavDropdown title={firstName(user.name)} id='regular-user'>
                    <Dropdown.Item as={Link} to='/followers'>
                      Followers
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to='/following'>
                      Following
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {user && user.isAdmin && (
                      <div>
                        <Dropdown.Item as={Link} to='/users'>
                          Users
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to='/messages'>
                          Messages
                        </Dropdown.Item>
                      </div>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} onClick={logOutHandler}>
                      Sign Out
                    </Dropdown.Item>
                  </NavDropdown>
                </div>
              ) : (
                <div className='d-flex gap-2'>
                  <Nav.Link as={Link} to='/posts'>
                    Posts
                  </Nav.Link>
                  <Nav.Link as={Link} to='/developers'>
                    Developers
                  </Nav.Link>
                  <Nav.Link className='btn-light' as={Link} to='/login'>
                    Sign In
                  </Nav.Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
