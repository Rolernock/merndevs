import { ListGroup, Image, Row, Col, Button, Alert } from 'react-bootstrap'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostCointainer from '../../components/PostContainer'
import { getFollowersById } from '../../slices/profileSlice'
import Spinner from '../../components/Spinner'
import { useDispatch, useSelector } from 'react-redux'

export default function FollowersByIdScreen() {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { followersById } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getFollowersById(profileId))
  }, [])

  return (
    <PostCointainer>
      {!followersById ? (
        <Spinner />
      ) : (
        <>
          <h1 className='mb-4 text-center'>Followers</h1>
          {followersById.length === 0 ? (
            <Alert>You are not being followed yet!</Alert>
          ) : (
            <>
              <ListGroup>
                {followersById.map(follower => (
                  <ListGroup.Item key={follower._id} className='my-2'>
                    <Row className='align-items-center'>
                      <Col md={2} className='text-center'>
                        <Link to={`/profile/${follower._id}`}>
                          <Image src={follower.avatar} roundedCircle fluid />
                        </Link>
                      </Col>
                      <Col md={8}>
                        <h4 className='mb-1'>{follower.name}</h4>
                        <p className='mb-0 text-muted'>{follower.bio}</p>
                        <small className='text-muted'>
                          {format(follower.createdAt, "dd MMM 'at' hh:mm a")}
                        </small>
                      </Col>
                      <Col md={2} className='text-end'>
                        <Button
                          as={Link}
                          to={`/profile/${follower._id}`}
                          className='btn-sm mx-1 btn-color'
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
        </>
      )}
    </PostCointainer>
  )
}
