import { ListGroup, Image, Row, Col, Button, Alert } from 'react-bootstrap'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PostCointainer from '../../components/PostContainer'
import { getFollowers } from '../../slices/profileSlice'
import Spinner from '../../components/Spinner'
import { useDispatch, useSelector } from 'react-redux'

export default function FollowersScreen() {
  const dispatch = useDispatch()
  const { followers } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getFollowers())
  }, [])

  return (
    <PostCointainer>
      {!followers ? (
        <Spinner />
      ) : (
        <>
          <h1 className='mb-4 text-center'>Followers</h1>
          {followers.length === 0 ? (
            <Alert>You are not being followed yet!</Alert>
          ) : (
            <>
              <ListGroup>
                {followers.map(follower => (
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
