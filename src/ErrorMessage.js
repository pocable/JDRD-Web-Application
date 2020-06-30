import React from 'react';
import PropTypes from 'prop-types'
import {Modal, Button} from 'react-bootstrap';

/**
 * Error message Modal used for the application
 * @version 1.0.0
 */
export default class ErrorMessage extends React.Component{


    static propTypes = {

        /** The title of the error message. */
        title: PropTypes.string,

        /** The body message of the error. */
        message: PropTypes.string,

        /** Function called when the window is closed. */
        onClosed: PropTypes.func
    }


    constructor(props){
        super(props);

        this.handleModalClose = this.handleModalClose.bind(this);
    }
    handleModalClose(){
        this.props.onClosed();
    }

    render(){
        return(
        <Modal
            show={true}
            onHide={this.handleModalClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.handleModalClose}>Close</Button>
            </Modal.Footer>
        </Modal>
        );
    }
}