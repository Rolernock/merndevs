import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ListGroup, Row, Col, Image, Button, Alert } from 'react-bootstrap'
import PostCointainer from '../../components/PostContainer'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { allProfiles } from '../../slices/profileSlice'
import Spinner from '../../components/Spinner'

export default function ProfilesScreen() {
  const dispatch = useDispatch()
  const { profiles } = useSelector(state => state.profiles)
  useEffect(() => {
    dispatch(allProfiles())
  }, [])
  return (
    <PostCointainer>
      {!profiles ? (
        <Spinner />
      ) : (
        <>
          <h1 className='mb-4 text-center'>Developers</h1>
          {profiles.length === 0 && <Alert>No Profiles Found.</Alert>}
          <ListGroup>
            {profiles.map(profile => (
              <ListGroup.Item key={profile._id} className='my-2'>
                <Row className='align-items-center'>
                  <Col md={2} className='text-center'>
                    <Link to={`/profile/${profile._id}`}>
                      <Image src={profile?.avatar} roundedCircle fluid />
                    </Link>
                  </Col>
                  <Col md={8}>
                    <h4 className='mb-1'>{profile?.name}</h4>
                    <p className='mb-0 text-muted'>{profile.bio}</p>
                    <small className='text-muted'>
                      {format(profile?.createdAt, "dd MMM 'at' hh:mm a")}
                    </small>
                  </Col>
                  <Col md={2}>
                    <Button
                      className='btn-sm btn-color'
                      as={Link}
                      to={`/profile/${profile._id}`}
                    >
                      View Profile
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </PostCointainer>
  )
}
