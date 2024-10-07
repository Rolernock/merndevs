import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { registerUser } from '../../slices/userSlice'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'

export default function RegisterScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.users)
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const redirect = queryParams.get('redirect') || '/'
  const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  const [formData, setFormData] = useState(initialState)
  const { name, email, password, confirmPassword } = formData
  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => {
      return { ...prevData, [name]: value }
    })
  }
  useEffect(() => {
    if (user) {
      navigate(redirect)
    }
  }, [user, navigate, redirect])
  const handleSubmit = evt => {
    evt.preventDefault()
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    dispatch(registerUser(formData))
    navigate(redirect)
  }
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            name='name'
            value={name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type='submit' className='mt-2 btn-color'>
          Sign Up
        </Button>
      </Form>
      <Row className='my-3'>
        <Col>
          Have an Account?{' '}
          <Link
            className='dark-text'
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
          >
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
