import { Modal, Button } from 'react-bootstrap'

export default function DeleteUserModal({ show, handleClose, handleConfirm }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
      <Modal.Footer>
        <Button className='btn-color' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='danger' onClick={handleConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
