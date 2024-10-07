import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaLink,
  FaBookReader,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../slices/userSlice'
import {
  currentProfile,
  deleteProfile,
  deleteAccount
} from '../../slices/profileSlice'
import { Button, Image, Row, Col } from 'react-bootstrap'
import PostContainer from '../../components/PostContainer'
import DeleteProfileModal from '../../components/DeleteProfileModal'
import DeleteAccountModal from '../../components/DeleteAccountModal'
import { format } from 'date-fns'

export default function ProfileScreen() {
  const dispatch = useDispatch()
  const { profile } = useSelector(state => state.profiles)
  const { user } = useSelector(state => state.users)
  const [showModal, setShowModal] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const closeAccountHandler = () => setShowAccount(false)
  const showAccountHandler = () => setShowAccount(true)
  const closeModalHandler = () => setShowModal(false)
  const showModalHandler = () => setShowModal(true)

  useEffect(() => {
    dispatch(currentProfile())
  }, [dispatch])

  const formatDate = dateStr => {
    const date = new Date(dateStr)
    return `Joined ${format(date, 'MMMM yyyy')}`
  }

  const handleDeleteProfile = () => {
    dispatch(deleteProfile())
    closeModalHandler()
  }

  const handleDeleteAccount = async () => {
    await dispatch(deleteAccount())
    dispatch(logOut())
    closeAccountHandler()
  }

  return (
    <PostContainer>
      <h1 className='text-center'>Dashboard</h1>
      <Row className='align-items-center mb-4'>
        <Col xs={12} md={2}>
          <Image src={user?.avatar} roundedCircle fluid />
        </Col>
        <Col xs={12} md={10}>
          <p className='text-large fw-bold'>Welcome, {user?.name}</p>
        </Col>
      </Row>

      {!profile ? (
        <>
          <p className='fs-3'>You have not yet set your profile, create one</p>
          <Button as={Link} className='btn-color' to='/create-profile'>
            Create Profile
          </Button>
        </>
      ) : (
        <>
          <h2>{profile?.bio}</h2>
          <p>
            <FaMapMarkerAlt className='mx-1 mb-1' />
            {profile?.location}
          </p>

          <div className='mb-3'>
            <strong>Skills:</strong>
            <ul className='list-unstyled'>
              {profile?.skills.map((skill, index) => (
                <li key={index} className='d-inline-block me-2'>
                  <span className='badge bg-secondary'>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='mb-3'>
            <Link to='/followers' className='text-decoration-none'>
              Followers: {profile?.followers.length}
            </Link>{' '}
            |{' '}
            <Link to='/following' className='text-decoration-none'>
              Following: {profile?.following.length}
            </Link>
          </div>

          <p>
            <Link
              className='text-decoration-none'
              target='_blank'
              to={`https://${profile?.website}`}
            >
              <FaLink className='mx-1' />
              {profile?.website}
            </Link>
          </p>

          <p>
            <strong>GitHub:</strong>{' '}
            <Link
              className='text-decoration-none'
              to={`https://github.com/${profile.githubusername}`}
              target='_blank'
            >
              {profile.githubusername}
            </Link>
          </p>

          <div className='d-flex gap-3'>
            {profile?.social?.linkedin && (
              <Link
                className='text-decoration-none'
                target='_black'
                to={`https://${profile?.social?.linkedin}`}
              >
                <FaLinkedin />
              </Link>
            )}
            {profile?.social?.X && (
              <Link
                className='text-decoration-none'
                target='_black'
                to={`https://${profile?.social.X}`}
              >
                <FaTwitter />
              </Link>
            )}
          </div>

          <div className='my-2'>
            <Link to='/projects' className='fst-italic text-decoration-none'>
              <FaBookReader className='mx-1 mb-1' />
              Projects
            </Link>
          </div>

          <p>
            <FaRegCalendarAlt className='mx-1 mb-1' />
            {formatDate(profile.createdAt)}
          </p>

          <Button as={Link} className='btn-color' to='/update-profile'>
            Edit Profile
          </Button>
          <Button variant='danger' onClick={showModalHandler} className='mx-1'>
            Delete Profile
          </Button>
          <Row>
            <Col className='d-flex justify-content-center my-3'>
              <Button onClick={showAccountHandler} variant='danger w-100'>
                Delete Account
              </Button>
            </Col>
          </Row>
        </>
      )}
      <DeleteProfileModal
        show={showModal}
        handleClose={closeModalHandler}
        handleConfirm={() => handleDeleteProfile()}
      />
      <DeleteAccountModal
        show={showAccount}
        handleClose={closeAccountHandler}
        handleConfirm={() => handleDeleteAccount()}
      />
    </PostContainer>
  )
}
