import { ListGroup, Image, Row, Col, Button, Alert } from 'react-bootstrap'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostCointainer from '../../components/PostContainer'
import { format } from 'date-fns'
import { getFollowingById } from '../../slices/profileSlice'
import Spinner from '../../components/Spinner'
import { useDispatch, useSelector } from 'react-redux'

export default function FollowingByIdScreen() {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { followingById } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getFollowingById(profileId))
  }, [])

  return (
    <PostCointainer>
      {!followingById ? (
        <Spinner />
      ) : (
        <>
          <h1 className='mb-4 text-center'>Following</h1>
          {followingById.length === 0 ? (
            <Alert>
              <h2>You are not following anyone yet!</h2>
            </Alert>
          ) : (
            <>
              <ListGroup>
                {followingById.map(follow => (
                  <ListGroup.Item key={follow._id} className='my-2'>
                    <Row className='align-items-center'>
                      <Col md={2} className='text-center'>
                        <Link to={`/profile/${follow._id}`}>
                          <Image src={follow.avatar} roundedCircle fluid />
                        </Link>
                      </Col>
                      <Col md={8}>
                        <h4 className='mb-1'>{follow.name}</h4>
                        <p className='mb-0 text-muted'>{follow.bio}</p>
                        <small className='text-muted'>
                          {format(follow.createdAt, "dd MMM 'at' hh:mm a")}
                        </small>
                      </Col>
                      <Col md={2} className='text-end'>
                        <Button
                          as={Link}
                          to={`/profile/${follow._id}`}
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
