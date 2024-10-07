import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { resetPassword } from '../../slices/userSlice'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const initialState = { password: '', confirmPassword: '' }
  const [formData, setFormData] = useState(initialState)
  const { password, confirmPassword } = formData
  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => {
      return { ...prevData, [name]: value }
    })
  }
  const handleSubmit = evt => {
    evt.preventDefault()
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    } else {
      dispatch(resetPassword({ token, password }))
      navigate('/login')
    }
  }
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter New Password'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter New Password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type='submit' className='btn-color'>
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  )
}
