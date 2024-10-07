import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PostCointainer from '../../components/PostContainer'
import { addPost, uploadPostImage } from '../../slices/postSlice'
import { toast } from 'react-toastify'

export default function AddPost() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const initialState = {
    subject: '',
    image: '',
    content: ''
  }
  const [formData, setFormData] = useState(initialState)
  const { subject, image, content } = formData

  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const uploadFileHandler = async evt => {
    const imageData = new FormData()
    imageData.append('image', evt.target.files[0])
    const res = await dispatch(uploadPostImage(imageData)).unwrap()
    setFormData(prevData => ({
      ...prevData,
      image: res.image
    }))
    toast.success(res.msg)
  }
  const handleSubmit = evt => {
    evt.preventDefault()
    console.log(formData)
    dispatch(addPost(formData))
    navigate('/posts')
  }
  return (
    <>
      <PostCointainer>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='subject' className='my-2'>
            <Form.Label>Post Subject</Form.Label>
            <Form.Control
              type='text'
              name='subject'
              value={subject}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId='content' className='my-2'>
            <Form.Label>Post Body</Form.Label>
            <Form.Control
              as='textarea'
              rows='7'
              name='content'
              value={content}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId='imageUpload' className='my-2'>
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type='file' onChange={uploadFileHandler} />
          </Form.Group>
          <Button type='submit' className='btn-color'>
            Submit Post
          </Button>
        </Form>
      </PostCointainer>
    </>
  )
}
