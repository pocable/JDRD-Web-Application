import React from 'react';
import PropTypes from 'prop-types'
import {Button, Modal} from 'react-bootstrap';
import ConfirmMessage from './ConfirmMessage';
import {MdCancel} from 'react-icons/md';

/**
 * An object representing an item currently being downloaded by DLAPI
 * @see DownloadMonitor
 */
export default class DownloadMonitorItem extends React.Component{

    state = {'title': '', 'path': '', 'rd_code': '', 'deleted': false, 'deleteError': false, 'statusCode': '',
        'confirmState': false, 'confirmMessage': ''}
    
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
        this.onConfirmClosed = this.onConfirmClosed.bind(this);
        this.onConfirmClicked = this.onConfirmClicked.bind(this);
        this.onCancelClicked = this.onCancelClicked.bind(this);
    }

    handleModalClose(){
        this.setState({'deleteError': false});
    }

    onConfirmClicked(){
        this.cancelDownload();
        this.setState({'confirmState': false});
    }

    onConfirmClosed(){
        this.setState({'confirmState': false});
    }

    onCancelClicked(){
        this.setState({'confirmState': true, 'confirmMessage': 'Cancel ' + this.props.title + '?'})
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

        var confirmModel;
        if(this.state.confirmState){
            confirmModel = (<ConfirmMessage message={this.state.confirmMessage} onConfirm={this.onConfirmClicked} onCancel={this.onConfirmClosed}/>)
        }
        return(
                <tr>
                    {confirmModel}
                    <Modal show={this.state.deleteError} onHide={this.handleModalClose}>
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
                    <td className="MovieTitle">{this.props.title.replaceAll(".", " ")}</td>
                    <td>{this.props.path}</td>
                    <td><Button variant="danger" onClick={this.onCancelClicked}><MdCancel /></Button></td>
                </tr>
        );
    }
}