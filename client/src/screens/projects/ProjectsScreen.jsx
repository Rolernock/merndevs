import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaTrash } from 'react-icons/fa'
import PostCointainer from '../../components/PostContainer'
import { Card, Alert, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Spinner from '../../components/Spinner'
import { getProjects, deleteProject } from '../../slices/profileSlice'
import { format } from 'date-fns'

export default function ProjectsScreen() {
  const dispatch = useDispatch()
  const { projects } = useSelector(state => state.profiles)

  useEffect(() => {
    dispatch(getProjects())
  }, [])

  const deleteProjectHandler = async projectId => {
    await dispatch(deleteProject(projectId))
    dispatch(getProjects())
  }

  return (
    <PostCointainer>
      {!projects ? (
        <Spinner />
      ) : (
        <>
          <h2 className='text-center'>Projects</h2>
          <div className='d-flex justify-content-center'>
            <Button as={Link} to='/new-project' className='btn-color my-2'>
              <FaPlus className='mb-1 mx-1' />
              Add Project
            </Button>
          </div>
          {projects.length === 0 ? (
            <Alert>You have not created any projects yet.</Alert>
          ) : (
            <Row>
              {projects.map(project => (
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
                        <Button
                          variant='danger'
                          onClick={() => deleteProjectHandler(project._id)}
                          className='btn-sm'
                        >
                          <FaTrash />
                        </Button>
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
