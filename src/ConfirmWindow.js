import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button} from 'react-bootstrap';

/**
 * Confirm window used to confirm the provided action.
 * @version 1.0.0
 */
export default class ConfirmWindow extends React.Component{
    
    static propTypes = {
        /** The message to show on the main box. */
        message: PropTypes.string,

        /** The function to call when confirmed. */
        onConfirm: PropTypes.func,

        /** The function to call when closed. */
        onClose: PropTypes.func
    }

    render(){
        return (
            <Modal
            show={true}
            onHide={this.props.onClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={this.props.onConfirm}>Confirm</Button>
                <Button variant="danger" onClick={this.props.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
        )
    }
}