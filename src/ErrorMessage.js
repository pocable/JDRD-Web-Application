import React from 'react';
import {Modal, Button} from 'react-bootstrap';

/*

Required Props
title: string
message: string
onClosed: function
*/

export default class ErrorMessage extends React.Component{

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