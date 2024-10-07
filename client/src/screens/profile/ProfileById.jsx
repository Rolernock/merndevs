import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaLink,
  FaTwitter,
  FaLinkedin,
  FaBookReader
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
  getProfileById,
  followUser,
  unfollowUser
} from '../../slices/profileSlice'
import { Image, Row, Col, Button, Badge } from 'react-bootstrap'
import PostContainer from '../../components/PostContainer'
import Spinner from '../../components/Spinner'
import { format } from 'date-fns'

export default function ProfileById() {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { profileById } = useSelector(state => state.profiles)
  const { profile } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getProfileById(profileId))
  }, [dispatch])

  const handleFollow = async () => {
    await dispatch(followUser(profileId))
    dispatch(getProfileById(profileId))
  }

  const handleUnfollow = async () => {
    await dispatch(unfollowUser(profileId))
    dispatch(getProfileById(profileId))
  }

  const formatDate = dateStr => {
    const date = new Date(dateStr)
    return `Joined ${format(date, 'MMMM yyyy')}`
  }

  return (
    <PostContainer>
      <h1 className='text-center'>Dashboard</h1>
      <Row className='align-items-center mb-4'>
        <Col xs={12} md={2}>
          <Image src={profileById?.avatar} roundedCircle fluid />
        </Col>
        <Col xs={12} md={10}>
          <p className='text-large fw-bold'>{profileById?.name}</p>
        </Col>
      </Row>

      {!profileById ? (
        <Spinner />
      ) : (
        <>
          <h2>{profileById?.bio}</h2>
          {profile._id !== profileById._id && (
            <div className='d-flex gap-2 my-3'>
              <Button
                onClick={() => handleFollow(profileById._id)}
                className='btn-sm btn-color'
              >
                Follow{' '}
                <Badge className='bg-secondary'>
                  {profileById?.followers?.length}
                </Badge>
              </Button>
              <Button
                onClick={() => handleUnfollow(profileById._id)}
                className='btn-sm btn-color'
              >
                Unfollow
              </Button>
            </div>
          )}
          <p>
            <FaMapMarkerAlt className='mx-1 mb-1' />
            {profileById?.location}
          </p>

          <div className='mb-3'>
            <strong>Skills:</strong>
            <ul className='list-unstyled'>
              {profileById?.skills.map((skill, index) => (
                <li key={index} className='d-inline-block me-2'>
                  <span className='badge bg-secondary'>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='mb-3'>
            <Link
              to={`/followers/${profileById._id}`}
              className='text-decoration-none'
            >
              Followers: {profileById?.followers.length}
            </Link>{' '}
            |{' '}
            <Link
              to={`/following/${profileById._id}`}
              className='text-decoration-none'
            >
              Following: {profileById?.following.length}
            </Link>
          </div>

          <p>
            {profileById?.website && (
              <Link
                className='text-decoration-none'
                target='_blank'
                to={`https://${profileById?.website}`}
              >
                <FaLink className='mx-1' />
                {profileById?.website}
              </Link>
            )}
          </p>

          <p>
            <strong>GitHub:</strong>{' '}
            <Link
              className='text-decoration-none'
              to={`https://github.com/${profileById.githubusername}`}
              target='_blank'
            >
              {profileById.githubusername}
            </Link>
          </p>
          <div className='d-flex gap-3 mb-2'>
            {profileById?.social?.linkedin && (
              <Link
                className='text-decoration-none'
                target='_black'
                to={`https://${profileById?.social?.linkedin}`}
              >
                <FaLinkedin />
              </Link>
            )}
            {profileById?.social?.X && (
              <Link
                className='text-decoration-none'
                target='_black'
                to={`https://${profileById?.social.X}`}
              >
                <FaTwitter />
              </Link>
            )}
          </div>

          <div className='my-2'>
            <Link
              to={`/projects/${profileById._id}`}
              className='fst-italic text-decoration-none'
            >
              <FaBookReader className='mx-1 mb-1' />
              Projects
            </Link>
          </div>

          <p>
            <FaRegCalendarAlt className='me-1 mb-1' />
            {formatDate(profileById.createdAt)}
          </p>
        </>
      )}
    </PostContainer>
  )
}
