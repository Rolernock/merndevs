import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { addProject } from '../../slices/profileSlice'
import FormContainer from '../../components/FormContainer'

export default function NewProject() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialState = {
    title: '',
    description: '',
    link: '',
    technologies: '',
    startDate: '',
    status: ''
  }
  const [formData, setFormData] = useState(initialState)
  const { title, description, link, technologies, startDate, status } = formData
  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSubmit = async evt => {
    evt.preventDefault()
    const res = await dispatch(addProject(formData)).unwrap()
    if (res.projects) {
      navigate('/projects')
    }
  }
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='title' className='my-2'>
          <Form.Label className='fst-italic'>
            Project Title/Company Name
          </Form.Label>
          <Form.Control
            type='text'
            name='title'
            value={title}
            onChange={handleChange}
            placeholder='Enter your project title...'
          />
        </Form.Group>
        <Form.Group controlId='description' className='my-2'>
          <Form.Label className='fst-italic'>Project Description</Form.Label>
          <Form.Control
            as='textarea'
            rows='4'
            name='description'
            value={description}
            onChange={handleChange}
            placeholder='Describe you project briefly...'
          />
        </Form.Group>
        <Form.Group controlId='link' className='my-2'>
          <Form.Label className='fst-italic'>Project Link</Form.Label>
          <Form.Control
            type='text'
            name='link'
            value={link}
            onChange={handleChange}
            placeholder='merndevs.com'
          />
        </Form.Group>
        <Form.Group controlId='technologies' className='my-2'>
          <Form.Label className='fst-italic'>Technologies Used</Form.Label>
          <Form.Control
            type='text'
            name='technologies'
            value={technologies}
            onChange={handleChange}
            placeholder='CSS, JS, MONGODB'
          />
        </Form.Group>
        <Form.Group controlId='startDate' className='my-2'>
          <Form.Label className='fst-italic'>Start Date(YYYY/MM/DD)</Form.Label>
          <Form.Control
            type='text'
            name='startDate'
            value={startDate}
            onChange={handleChange}
            placeholder='2020-07-18'
          />
        </Form.Group>
        <Form.Group controlId='status' className='my-2'>
          <Form.Label className='fst-italic'>Status</Form.Label>
          <Form.Select name='status' value={status} onChange={handleChange}>
            <option value=''>Choose Status</option>
            <option value='completed'>completed</option>
            <option value='in progress'>In Progress</option>
          </Form.Select>
        </Form.Group>
        <Button type='submit' className='btn-color'>
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}
