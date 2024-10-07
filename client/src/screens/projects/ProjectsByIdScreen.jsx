import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaTrash } from 'react-icons/fa'
import PostCointainer from '../../components/PostContainer'
import { Card, Alert, Row, Col, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { getProjectsById } from '../../slices/profileSlice'
import { format } from 'date-fns'

export default function ProjectByIdScreen() {
  const dispatch = useDispatch()
  const { profileId } = useParams()
  const { projectsById } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getProjectsById(profileId))
  }, [])

  return (
    <PostCointainer>
      {!projectsById ? (
        <Spinner />
      ) : (
        <>
          <h2 className='text-center'>Projects</h2>
          {projectsById.length === 0 ? (
            <Alert>Developer hasn't created any project yet.</Alert>
          ) : (
            <Row>
              {projectsById.map(project => (
                <Col md={4} key={project._id} className='my-3'>
                  <Card>
                    <Card.Body>
                      <Card.Title>{project.title}</Card.Title>
                      <Card.Text className=' text-muted'>
                        <div className='fst-italic'>{project.description}</div>
                        <br />
                        <strong>Status:</strong> {project.status}
                        <br />
                        <strong>Start Date:</strong>{' '}
                        {project.startDate ? (
                          format(project.startDate, 'MMMM yyyy')
                        ) : (
                          <>NULL</>
                        )}
                        <br />
                        <strong>Techonologies:</strong>{' '}
                        {project.technologies.join(', ')}
                      </Card.Text>
                      <div className='d-flex justify-content-between gap-1'>
                        {project.link && (
                          <Button
                            className='btn-color btn-sm'
                            as={Link}
                            target='_blank'
                            to={`https://${project.link}`}
                          >
                            View Project
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </PostCointainer>
  )
}
