import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaComments,
  FaTrash,
  FaReply,
  FaRegCalendarAlt
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {
  Image,
  Card,
  Button,
  Row,
  Col,
  Alert,
  ListGroup,
  Form
} from 'react-bootstrap'
import {
  getPostById,
  getComments,
  addComment,
  deleteComment,
  deletePost,
  likeComment,
  unlikeComment,
  likeNestedComment,
  unlikeNestedComment,
  deleteNestedComment,
  addNestedComment
} from '../../slices/postSlice'
import { useParams } from 'react-router-dom'
import PostCointainer from '../../components/PostContainer'
import Spinner from '../../components/Spinner'
import DeletePostModel from '../../components/DeletePostModel'

export default function PostScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { postId } = useParams()
  const { post } = useSelector(state => state.posts)
  const { user } = useSelector(state => state.users)
  const { comments } = useSelector(state => state.posts)
  const [nestedCommentsVisibility, setNestedCommentsVisibility] = useState({})
  const [replyFormVisibility, setReplyFormVisibility] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ content: '' })
  const [replyContent, setReplyContent] = useState({ nestedContent: '' })
  const { nestedContent } = replyContent
  const { content } = formData
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getPostById(postId))
      await dispatch(getComments(postId))
    }
    fetchData()
  }, [postId])

  const handleThumbsUp = async (postId, commentId) => {
    await dispatch(likeComment({ postId, commentId }))
    dispatch(getComments(postId))
  }

  const handleThumbsDown = async (postId, commentId) => {
    await dispatch(unlikeComment({ postId, commentId }))
    dispatch(getComments(postId))
  }

  const handleNestedThumbsUp = async (postId, commentId, id) => {
    await dispatch(likeNestedComment({ postId, commentId, id }))
    dispatch(getComments(postId))
  }

  const handleNestedThumbsDown = async (postId, commentId, id) => {
    await dispatch(unlikeNestedComment({ postId, commentId, id }))
    dispatch(getComments(postId))
  }

  const handleDeleteNestedComment = async (postId, commentId, id) => {
    await dispatch(deleteNestedComment({ postId, commentId, id }))
    dispatch(getComments(postId))
  }

  const handleDeletePost = postId => {
    dispatch(deletePost(postId))
    handleCloseModal()
    navigate('/posts')
  }

  const handleDeleteComment = async (postId, commentId) => {
    await dispatch(deleteComment({ postId, commentId }))
    dispatch(getComments(postId))
  }

  const toggleNestedComments = commentId => {
    setNestedCommentsVisibility(prevData => ({
      ...prevData,
      [commentId]: !prevData[commentId]
    }))
  }

  const toggleReplyForm = commentId => {
    setReplyFormVisibility(prevData => ({
      ...prevData,
      [commentId]: !prevData[commentId]
    }))
  }

  const handleChange = evt => {
    const { name, value } = evt.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleNestedContentChange = evt => {
    const { name, value } = evt.target
    setReplyContent(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async evt => {
    evt.preventDefault()
    await dispatch(addComment({ postId, formData }))
    setFormData({ content: '' })
    dispatch(getComments(postId))
  }

  const handleReplySubmit = async (evt, commentId) => {
    evt.preventDefault()
    await dispatch(addNestedComment({ postId, commentId, replyContent }))
    setReplyContent({ nestedContent: '' })
    setReplyFormVisibility(prevData => ({ ...prevData, [commentId]: false }))
    dispatch(getComments(postId))
  }

  return (
    <>
      {!post ? (
        <Spinner />
      ) : (
        <PostCointainer>
          <Card className='my-3 p-3 rounded'>
            <div className='d-flex mb-3 align-items-center gap-3'>
              <div>
                <Link to={`/user/${post.user}`} className='d-flex'>
                  <Card.Img
                    as={Image}
                    className='w-small'
                    src={post.avatar}
                    fluid
                    roundedCircle
                  />
                </Link>
              </div>
              <div>
                <h5 className='mb-0'>{post.name}</h5>
                <small>
                  {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                </small>
              </div>
            </div>
            <Card.Header className='bg-transparent'>
              <h2 className='m-0'>{post.subject}</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>
            </Card.Body>
            {post?.image && <Image src={post.image} rounded />}
            {(user._id === post.user || user.isAdmin) && (
              <Button
                onClick={handleShowModal}
                variant='danger'
                className=' mt-3'
              >
                Delete Post
              </Button>
            )}
          </Card>
          <Card className='mb-2'>
            <Card.Header>
              <h2>Write a Comment</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='content' className='my-2'>
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows='3'
                    name='content'
                    value={content}
                    onChange={handleChange}
                    placeholder='Write your comment'
                  />
                  <Button type='submit' className='btn-color btn-sm my-2'>
                    Submit
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <h2>Comments</h2>
            </Card.Header>
            <Card.Body>
              {comments.length === 0 && <Alert>No Comments Yet</Alert>}
              <ListGroup>
                {comments &&
                  comments.map(comment => (
                    <ListGroup.Item key={comment._id}>
                      <Row className='align-items-center'>
                        <Col xs={12} md={2}>
                          <Link to={`/user/${comment.user}`} className='d-flex'>
                            <Card.Img
                              as={Image}
                              className='w-small'
                              src={comment.avatar}
                              fluid
                              roundedCircle
                            />
                          </Link>
                        </Col>
                        <Col xs={12} md={8}>
                          <h5 className='mb-0'>{comment.name}</h5>
                          <small>
                            <FaRegCalendarAlt className='mx-1 mb-1' />
                            {format(comment.createdAt, 'MMMM dd, yyyy hh:mm a')}
                          </small>
                          <p>{comment.content}</p>

                          <div className='d-flex align-items-center'>
                            <FaRegThumbsUp
                              className='thumbs-icon'
                              onClick={() =>
                                handleThumbsUp(post._id, comment._id)
                              }
                            />
                            {comment.likes.length > 0 && (
                              <small className='px-1'>
                                {comment.likes.length}
                              </small>
                            )}
                            <FaRegThumbsDown
                              className='mx-2 thumbs-icon'
                              onClick={() =>
                                handleThumbsDown(post._id, comment._id)
                              }
                            />
                          </div>

                          <Button
                            onClick={() => toggleNestedComments(comment._id)}
                            className='m-2 btn-color btn-outline-none btn-sm'
                          >
                            <FaComments className='mr-2' />{' '}
                            {comment.nestedComments.length} replies
                          </Button>
                          <Button
                            onClick={() => toggleReplyForm(comment._id)}
                            className='my-2 btn-color btn-outline-none btn-sm ml-2'
                          >
                            <FaReply /> Reply
                          </Button>

                          {replyFormVisibility[comment._id] && (
                            <Form
                              onSubmit={evt =>
                                handleReplySubmit(evt, comment._id)
                              }
                            >
                              <Form.Group
                                controlId='nestedContent'
                                className='my-2'
                              >
                                <Form.Control
                                  as='textarea'
                                  rows='2'
                                  value={nestedContent}
                                  name='nestedContent'
                                  onChange={handleNestedContentChange}
                                />
                                <Button
                                  type='submit'
                                  className='btn-color btn-sm my-2'
                                >
                                  Submit Reply
                                </Button>
                              </Form.Group>
                            </Form>
                          )}

                          {comment.nestedComments &&
                            comment.nestedComments.length > 0 &&
                            nestedCommentsVisibility[comment._id] && (
                              <ListGroup className='mt-3'>
                                {comment.nestedComments.map(nestedComment => (
                                  <ListGroup.Item
                                    key={nestedComment._id}
                                    className='nested-comment-item'
                                  >
                                    <Row className='align-items-center'>
                                      <Col xs={12} md={2}>
                                        <Link
                                          to={`/user/${nestedComment.user}`}
                                          className='d-flex'
                                        >
                                          <Card.Img
                                            as={Image}
                                            className='w-small'
                                            src={nestedComment.avatar}
                                            fluid
                                            roundedCircle
                                          />
                                        </Link>
                                      </Col>
                                      <Col xs={12} md={8}>
                                        <div className='mb-2'>
                                          <h6 className='mb-0'>
                                            {nestedComment.name}
                                          </h6>
                                          <small className='text-muted'>
                                            {formatDistanceToNow(
                                              nestedComment.date,
                                              { addSuffix: true }
                                            )}
                                          </small>
                                        </div>
                                        <p>{nestedComment.nestedContent}</p>

                                        <div className='d-flex align-items-center'>
                                          <FaRegThumbsUp
                                            className='thumbs-icon'
                                            onClick={() =>
                                              handleNestedThumbsUp(
                                                post._id,
                                                comment._id,
                                                nestedComment._id
                                              )
                                            }
                                          />
                                          {nestedComment.likes.length > 0 && (
                                            <small className='px-1'>
                                              {nestedComment.likes.length}
                                            </small>
                                          )}
                                          <FaRegThumbsDown
                                            className='mx-2 thumbs-icon'
                                            onClick={() =>
                                              handleNestedThumbsDown(
                                                post._id,
                                                comment._id,
                                                nestedComment._id
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                      <Col
                                        xs={12}
                                        md={2}
                                        className='text-md-left'
                                      >
                                        {((user &&
                                          user._id === nestedComment.user) ||
                                          user.isAdmin) && (
                                          <Button
                                            variant='danger'
                                            onClick={() =>
                                              handleDeleteNestedComment(
                                                post._id,
                                                comment._id,
                                                nestedComment._id
                                              )
                                            }
                                            className='btn-sm mt-2'
                                          >
                                            <FaTrash />
                                          </Button>
                                        )}
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            )}
                        </Col>
                        <Col xs={12} md={2} className='text-md-left'>
                          {((user && user._id === comment.user) ||
                            user.isAdmin) && (
                            <Button
                              variant='danger'
                              onClick={() =>
                                handleDeleteComment(post._id, comment._id)
                              }
                              className='btn-sm'
                            >
                              Delete
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </PostCointainer>
      )}
      <DeletePostModel
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={() => handleDeletePost(post._id)}
      />
    </>
  )
}
