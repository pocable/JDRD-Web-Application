import React from 'react';
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import MetadataRequestWindow from './MetadataRequestWindow';
import ConfirmWindow from './ConfirmWindow';
import { Textfit } from 'react-textfit';


/**
 * An object representing a movie, currently a button.
 * Responsible for submitting a download and visualizing a movie.
 * @version 1.0.2
 */
export default class MovieTile extends React.Component{

    state = {'errorState': false, 'message': '', 'askForMeta': false, 'confirmState': false, 'confirmMessage': ''}

    static propTypes = {
        /** The main download location path (contains subfolders tv and movies). */
        path: PropTypes.string,

        /** The URL/magnet link of the show. */
        link: PropTypes.string,

        /** The title of the show. */
        title: PropTypes.string,
        
        /** If the displayed item is a TV show or not. */
        isTv: PropTypes.bool
    }

    constructor(props){
        super(props);
        this.onErrorClosed = this.onErrorClosed.bind(this);
        this.downloadWithMeta = this.downloadWithMeta.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.download = this.download.bind(this);
        this.downloadButtonPressed = this.downloadButtonPressed.bind(this);
        this.onConfirmClicked = this.onConfirmClicked.bind(this);
        this.onConfirmClosed = this.onConfirmClosed.bind(this);
    }

    /**
     * Submit the URL prop for downloading on DLAPI with the tv path.
     * @param {string} showName The show name.
     * @param {string} seasonNumber The season number / representation.
     */
    downloadWithMeta(showName, seasonNumber){
        this.download(this.props.path + "tv/" + showName + "/" + seasonNumber + "/")
        this.setState({'askForMeta': false});
    }

    cancelModal(){
        this.setState({'askForMeta': false});
    }

    /**
     * Submit the URL prop for downloading on DLAPI to the path provided.
     * @param {string} path The path provided to download to. 
     */
    download(path){
        console.log('Submitting download to path: ' + path);
        fetch(window._env_.REACT_APP_DLAPI_LINK + 'api/v1/content', {
            method: 'post',
            headers: new Headers({
                'Authorization': window._env_.REACT_APP_DLAPI_API_KEY
            }),
            body: JSON.stringify({
                'url': this.props.link,
                'title': this.props.title,
                'path': path
            })
        }).then(response => {
            if(response.status !== 200){
                this.setState({'errorState': true, 'message': 'Recieved ' + response.status})
            }
        });
    }

    downloadButtonPressed(){
        if(this.props.isTV){
            this.setState({'askForMeta': true, 'confirmState': false});
            return;
        }
        this.setState({'confirmState': true, 'confirmMessage': 'Download ' + this.props.title + '?'});
    }

    onErrorClosed(){
        this.setState({'errorState': false});
    }


    // Called on the confirm dialogue.
    onConfirmClicked(){
        this.download(this.props.path + 'movies/')
        this.setState({'confirmState': false});
    }

    onConfirmClosed(){
        this.setState({'confirmState': false});
    }


    render(){

        // Can use same var since if its TV it will metadata request else if its a movie its a confirm window.
        var popup;
        if(this.state.askForMeta){
            popup = (<MetadataRequestWindow downloadWithMeta={this.downloadWithMeta} cancelModal={this.cancelModal}/>);
        }

        if(!this.props.isTV && this.state.confirmState){
            popup = (<ConfirmWindow message={this.state.confirmMessage} onConfirm={this.onConfirmClicked} onCancel={this.onConfirmClosed}/>)
        }

        var errorBubble;
        if(this.state.errorState){
            errorBubble = (<ErrorMessage title="Error Downloading Movie" message={this.state.message} onClosed={this.onErrorClosed}/>)
        }

        return (
            <>
                {errorBubble}
                {popup}
                <Button variant="secondary" size="lg" block onClick={this.downloadButtonPressed} title={this.props.title}>
                    <Textfit>
                        {this.props.title}
                    </Textfit>

                    <p>Seeders: {this.props.seeders}</p>
                </Button>
            </>
        );
    }
}