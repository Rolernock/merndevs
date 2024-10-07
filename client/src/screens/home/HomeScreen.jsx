import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllPosts } from '../../slices/postSlice'
import { Card, Button } from 'react-bootstrap'
import PostCointainer from '../../components/PostContainer'
import Paginate from '../../components/Paginate'
import PostItem from './PostItem'
import SearchBox from '../../components/SearchBox'
import Spinner from '../../components/Spinner'
import { FaPlus } from 'react-icons/fa'

export default function HomeScreen() {
  const dispatch = useDispatch()
  const {
    posts: { pages, posts }
  } = useSelector(state => state.posts)
  const { pageNumber, keyword } = useParams()
  useEffect(() => {
    dispatch(getAllPosts({ pageNumber, keyword }))
  }, [pageNumber, keyword, dispatch])
  return (
    <PostCointainer>
      <div className='d-flex justify-content-center'>
        <Button
          as={Link}
          to='/add-post'
          className='btn-color mb-3 text-align-right'
        >
          <FaPlus className='mb-1 mx-1' />
          Add Post
        </Button>
      </div>
      <SearchBox />
      {!posts ? (
        <Spinner />
      ) : (
        posts.map(post => (
          <Card key={post._id} className='my-3 p-3 rounded'>
            <PostItem posts={post} />
            <Paginate pages={pages} keyword={keyword} />
          </Card>
        ))
      )}
    </PostCointainer>
  )
}
