import React from 'react';
import {Modal} from 'react-bootstrap';

export default class LoadingScreen extends React.Component{

    render(){
        return (
            <Modal
            show={this.props.isLoading}>
            <Modal.Body>
                This is a loading screen.
            </Modal.Body>
        </Modal>
        );
    }
}