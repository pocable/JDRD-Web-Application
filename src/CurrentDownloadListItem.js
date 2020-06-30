import React from 'react';
import PropTypes from 'prop-types'
import {ListGroup, Button, Modal} from 'react-bootstrap';

/**
 * An object representing an item currently being downloaded by DLAPI
 * @see CurrentlyDownloading
 * @version 1.0.0
 */
export default class CurrentDownloadListItem extends React.Component{

    state = {'title': '', 'path': '', 'rd_code': '', 'deleted': false, 'deleteError': false, 'statusCode': ''}
    
    static propTypes = {
        /** The real debrid ID of the item. */
        rdid: PropTypes.string,

        /** The title of the item. */
        title: PropTypes.string,

        /** The storage path of where the item will be downloaded into on JDownloader. */
        path: PropTypes.string
    }

    
    constructor(props){
        super(props);
        this.cancelDownload = this.cancelDownload.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    handleModalClose(){
        this.setState({'deleteError': false});
    }

    /**
     * Cancels the download by sending a delete request to DLAPI.
     */
    cancelDownload(){
        fetch(window._env_.REACT_APP_DLAPI_LINK +'api/v1/content', {
            method: 'delete',
            headers: new Headers({
                'Authorization': window._env_.REACT_APP_DLAPI_API_KEY,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'id': this.props.rdid
            })
            }).then(response => {
                if(response.status === 200){
                    this.setState({'deleted': true});
                }else{
                    console.error('Status code returned was: ', response.status);
                    this.setState({'deleteError': true, 'statusCode': response.status});
                }
            }
        );
    }

    render(){
        if(this.state.deleted === true){ return null; }
        return(
            <div className="ListItem">
            <Modal
                show={this.state.deleteError}
                onHide={this.handleModalClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Error Canceling Download</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Recieved Status Code: {this.state.statusCode}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleModalClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <ListGroup.Item key={this.props.rdid}>{this.props.title} <br></br> {this.props.path} - {this.props.rdid} <br></br><Button variant="danger" onClick={this.cancelDownload}>Cancel Download</Button></ListGroup.Item>
            </div>
        );
    }
}