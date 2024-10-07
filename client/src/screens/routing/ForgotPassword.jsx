import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../../components/FormContainer'
import { resetPasswordEmail } from '../../slices/userSlice'

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const handleSubmit = evt => {
    evt.preventDefault()
    dispatch(resetPasswordEmail(email))
    navigate('/')
  }
  return (
    <FormContainer>
      <h1>Forgot Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={email}
            onChange={evt => setEmail(evt.target.value)}
          />
        </Form.Group>
        <Button type='submit' className='btn-color mt-2'>
          Send Reset Link
        </Button>
      </Form>
    </FormContainer>
  )
}
