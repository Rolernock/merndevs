import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaComments,
  FaRegCalendarAlt
} from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { Image, Card, Button } from 'react-bootstrap'
import {
  likeAPost,
  getAllPosts,
  unlikePost,
  readPost
} from '../../slices/postSlice'

export default function PostItem({
  posts: {
    _id,
    user,
    avatar,
    name,
    likes,
    content,
    reads,
    image,
    subject,
    createdAt
  }
}) {
  const dispatch = useDispatch()
  const { keyword, pageNumber } = useParams()
  const markRead = postId => {
    dispatch(readPost(postId))
  }
  const dislikePost = async postId => {
    await dispatch(unlikePost(postId))
    dispatch(getAllPosts({ keyword, pageNumber }))
  }
  const likePost = async postId => {
    await dispatch(likeAPost(postId))
    dispatch(getAllPosts({ keyword, pageNumber }))
  }
  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length)
    }
    return text
  }

  const formatedTime = format(new Date(createdAt), 'MMMM dd, yyyy hh:mm a')
  return (
    <>
      <div className='d-flex mb-3 align-items-center gap-3'>
        <div>
          <Link to={`/user/${user?._id}`} className='d-flex'>
            <Card.Img
              as={Image}
              className='w-small'
              src={avatar}
              fluid
              roundedCircle
            />
          </Link>
        </div>
        <div>
          <h5 className='mb-0'>{name}</h5>
          <small className='text-muted'>
            <FaRegCalendarAlt className='mb-1 mx-1' /> {formatedTime}
          </small>
        </div>
      </div>
      <Card.Header className='bg-transparent'>
        <h3 className='m-0'>{subject}</h3>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {truncateText(content, 100)}
          <Link
            className='text-decoration-none px-2'
            to={`/post/${_id}`}
            onClick={() => markRead(_id)}
          >
            Read More...
          </Link>
        </Card.Text>
      </Card.Body>
      {image && <Image src={image} rounded />}
      <Card.Footer className='bg-transparent'>
        <div className='d-flex justify-content-between flex-between align-items-center pt-2 gap-1'>
          <div className='d-flex gap-3'>
            <div className='text-center'>
              <FaRegThumbsUp
                onClick={() => likePost(_id)}
                className='icon-custom'
              />
              {likes.length > 0 && (
                <small className='px-1'>{likes.length}</small>
              )}
            </div>
            <FaRegThumbsDown
              onClick={() => dislikePost(_id)}
              className='icon-custom mt-2'
            />
            <Button
              onClick={() => markRead(_id)}
              as={Link}
              to={`/post/${_id}`}
              className='btn-color xs-btn btn-sm'
            >
              <FaComments className='mx-2' />
              Comments
            </Button>
          </div>
          <div>
            <Link
              className='mx-2 dark-text text-muted text-decoration-none'
              to={`/post/reads`}
            >
              {reads.length} reads
            </Link>
          </div>
        </div>
      </Card.Footer>
    </>
  )
}
