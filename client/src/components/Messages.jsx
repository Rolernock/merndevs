import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from 'react-icons/fa'
import PostCointainer from './PostContainer'
import { Card, Alert, Row, Col, Button } from 'react-bootstrap'
import Spinner from './Spinner'
import { allMessages, deleteMessage } from '../slices/userSlice'
import { format } from 'date-fns'

export default function Messages() {
  const dispatch = useDispatch()
  const { messages } = useSelector(state => state.users)

  useEffect(() => {
    dispatch(allMessages())
  }, [])

  const deleteMessageHandler = async messageId => {
    await dispatch(deleteMessage(messageId))
    dispatch(allMessages())
  }

  return (
    <PostCointainer>
      {!messages ? (
        <Spinner />
      ) : (
        <>
          <h2 className='text-center'>Messages</h2>
          {messages.length === 0 ? (
            <Alert>You have no messages yet.</Alert>
          ) : (
            <Row>
              {messages.map(message => (
                <Col md={4} key={message._id} className='my-3'>
                  <Card>
                    <Card.Body>
                      <Card.Title>{message.subject}</Card.Title>
                      <Card.Text className=' text-muted'>
                        <span className='fst-italic'>{message.message}</span>
                        <br />
                        <strong>Name:</strong> {message.name}
                        <br />
                        <strong>Email:</strong> {message.email}
                        <br />
                        {message.whatsAppNumber && (
                          <span>
                            <strong>WhatsApp Number: </strong>{' '}
                            {message.whatsAppNumber}
                          </span>
                        )}
                        <br />
                        <strong>Date Sent:</strong>{' '}
                        {format(message.createdAt, 'MMMM yyyy hh:mm a')}
                      </Card.Text>

                      <Button
                        variant='danger'
                        onClick={() => deleteMessageHandler(message._id)}
                        className='btn-sm'
                      >
                        <FaTrash />
                      </Button>
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
