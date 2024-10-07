import { addProfile, currentProfile } from '../../slices/profileSlice'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { useNavigate } from 'react-router-dom'

export default function CreateProfileScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile } = useSelector(state => state.profiles)
  const initialState = {
    githubusername: '',
    website: '',
    location: '',
    skills: '',
    bio: '',
    X: '',
    linkedin: ''
  }
  const [formData, setFormData] = useState(initialState)
  const { githubusername, website, location, skills, bio, X, linkedin } =
    formData
  useEffect(() => {
    dispatch(currentProfile())
  }, [])
  useEffect(() => {
    if (profile) {
      setFormData({
        githubusername: profile.githubusername || '',
        website: profile.website || '',
        location: profile.location || '',
        skills: profile.skills || '',
        bio: profile.bio || '',
        X: profile.social.X,
        linkedin: profile.social.linkedin || ''
      })
    }
  }, [profile])

  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSubmit = async evt => {
    evt.preventDefault()
    const res = await dispatch(addProfile(formData)).unwrap()
    if (res.user) {
      navigate('/profile')
    }
  }
  return (
    <FormContainer>
      {profile ? (
        <h2 className='text-center'>Update Your Profile</h2>
      ) : (
        <h2 className='text-center'>Create Your Profile</h2>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='bio' className='my-2'>
          <Form.Label className='fst-italic'>*Bio</Form.Label>
          <Form.Control
            type='text'
            name='bio'
            placeholder='Full Stack Web Developer'
            value={bio}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='githubusername' className='my-2'>
          <Form.Label className='fst-italic'>*Githubusername</Form.Label>
          <Form.Control
            type='text'
            name='githubusername'
            placeholder='Nyawawa'
            value={githubusername}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='skills' className='my-2'>
          <Form.Label className='fst-italic'>*Skills</Form.Label>
          <Form.Control
            type='text'
            name='skills'
            placeholder='HTML, CSS, JS'
            value={skills}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='website' className='my-2'>
          <Form.Label className='fst-italic'>Webiste</Form.Label>
          <Form.Control
            type='text'
            name='website'
            placeholder='rolerfy.xyz'
            value={website}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='location' className='my-2'>
          <Form.Label className='fst-italic'>Location</Form.Label>
          <Form.Control
            type='text'
            name='location'
            placeholder="Murang'a, Kenya"
            value={location}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='X' className='my-2'>
          <Form.Label className='fst-italic'>X (Twitter Account)</Form.Label>
          <Form.Control
            type='text'
            name='X'
            placeholder='x.com/rolernock'
            value={X}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId='linkedin' className='my-2'>
          <Form.Label className='fst-italic'>LinkedIn</Form.Label>
          <Form.Control
            type='text'
            name='linkedin'
            placeholder='linkedin.com/in/rolernock-goines-753312226'
            value={linkedin}
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
