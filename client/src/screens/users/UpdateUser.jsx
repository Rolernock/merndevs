import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { updateUser, getUserById } from '../../slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../../components/FormContainer'

export default function UpdateUser() {
  const { userId } = useParams()
  const { userById } = useSelector(state => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialState = {
    name: '',
    email: '',
    password: '',
    isAdmin: false
  }
  useEffect(() => {
    dispatch(getUserById(userId))
  }, [userId])
  useEffect(() => {
    if (userById) {
      setFormData({
        name: userById.name || '',
        email: userById.email || '',
        password: '',
        isAdmin: userById.isAdmin || false
      })
    }
  }, [userById])
  const [formData, setFormData] = useState(initialState)
  const { name, email, password, isAdmin } = formData
  const handleChange = evt => {
    const { name, value, type, checked } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  const handleSubmit = evt => {
    evt.preventDefault()
    if (!password) {
      delete formData.password
    }
    dispatch(updateUser({ formData, userId }))
    navigate('/users')
  }

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name' className='my-2'>
          <Form.Label className='fst-italic'>Name</Form.Label>
          <Form.Control
            type='text'
            name='name'
            value={name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='email' className='my-2'>
          <Form.Label className='fst-italic'>Email</Form.Label>
          <Form.Control
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='checkbox' className='my-2'>
          <Form.Label className='fst-italic'>Password</Form.Label>
          <Form.Control
            type='text'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='isAdmin' className='my-2'>
          <Form.Check
            type='checkbox'
            name='isAdmin'
            label='isAdmin'
            checked={isAdmin}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type='submit' className='btn-color'>
          Update
        </Button>
      </Form>
    </FormContainer>
  )
}
