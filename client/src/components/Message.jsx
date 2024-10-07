import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from './FormContainer'
import { sendMessage } from '../slices/userSlice'

export default function Message() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialState = {
    subject: '',
    whatsAppNumber: '',
    message: ''
  }
  const [formData, setFormData] = useState(initialState)
  const { subject, whatsAppNumber, message } = formData
  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSubmit = async evt => {
    evt.preventDefault()
    const res = await dispatch(sendMessage(formData)).unwrap()
    if (res.msg) {
      navigate('/posts')
    }
  }
  return (
    <FormContainer>
      <h2 className='fst-italic text-center'>Contact Developer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='subject' className='my-2'>
          <Form.Label className='fst-italic'>Subject</Form.Label>
          <Form.Control
            type='text'
            name='subject'
            value={subject}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='whatsAppNumber' className='my-2'>
          <Form.Label className='fst-italic'>WhatsApp Number</Form.Label>
          <Form.Control
            type='text'
            name='whatsAppNumber'
            value={whatsAppNumber}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='message' className='my-2'>
          <Form.Label className='fst-italic'>Message</Form.Label>
          <Form.Control
            as='textarea'
            rows='5'
            name='message'
            value={message}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type='submit' className='btn-color'>
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}
