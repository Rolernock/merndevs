import { ListGroup, Image, Row, Col, Button } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import PostCointainer from '../../components/PostContainer'
import { useEffect, useState } from 'react'
import { allUsers, deleteUser } from '../../slices/userSlice'
import Spinner from '../../components/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import DeleteUserModal from '../../components/DeleteUserModel'

export default function UserScreen() {
  const dispatch = useDispatch()
  const { keyword } = useParams()
  const { users } = useSelector(state => state.users)
  const [showModal, setShowModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = userId => {
    setSelectedUserId(userId)
    setShowModal(true)
  }
  const handleDeleteUser = async userId => {
    if (selectedUserId) {
      await dispatch(deleteUser(userId))
      dispatch(allUsers({ keyword }))
      handleCloseModal()
    }
  }

  useEffect(() => {
    dispatch(allUsers({ keyword }))
  }, [keyword])

  return (
    <PostCointainer>
      {!users ? (
        <Spinner />
      ) : (
        <>
          <h1 className='mb-4 text-center'>Users</h1>
          <ListGroup>
            {users.map(user => (
              <ListGroup.Item key={user._id} className='my-2'>
                <Row className='align-items-center'>
                  <Col md={2} className='text-center'>
                    <Link to={`/user/${user._id}`}>
                      <Image src={user.avatar} roundedCircle fluid />
                    </Link>
                  </Col>
                  <Col md={8}>
                    <h4 className='mb-1'>{user.name}</h4>
                    <p className='mb-0 text-muted'>{user.email}</p>
                    <small className='text-muted'>
                      Joined{' '}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true
                      })}
                    </small>
                  </Col>
                  <Col md={2} className='text-end'>
                    <Button
                      as={Link}
                      to={`/user/${user._id}`}
                      className='btn-sm mx-1 btn-color'
                    >
                      Edit
                    </Button>
                    <Button
                      className='btn-sm'
                      variant='danger'
                      onClick={() => handleShowModal(user._id)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
                <DeleteUserModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  handleConfirm={() => handleDeleteUser(selectedUserId)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </PostCointainer>
  )
}
