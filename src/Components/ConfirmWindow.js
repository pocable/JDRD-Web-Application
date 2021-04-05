import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button} from 'react-bootstrap';

/**
 * Confirm window used to confirm the provided action.
 */
export default class ConfirmWindow extends React.Component{
    
    static propTypes = {
        /** The message to show on the main box. */
        message: PropTypes.string,

        /** The function to call when confirmed. */
        onConfirm: PropTypes.func,

        /** The function to call when closed. */
        onCancel: PropTypes.func
    }

    constructor(props){
        super(props);
        this.onConfirmPressed = this.onConfirmPressed.bind(this);
        this.onClosePressed = this.onClosePressed.bind(this);
    }

    onClosePressed(){
        this.props.onCancel();
    }

    onConfirmPressed(){
        this.props.onConfirm();
    }

    render(){
        return (
            <Modal
            show={true}
            onHide={this.onClosePressed}
        >
            <Modal.Header>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={this.onConfirmPressed}>Confirm</Button>
                <Button variant="danger" onClick={this.onClosePressed}>Close</Button>
            </Modal.Footer>
        </Modal>
        )
    }
}