import React from 'react';
import {Button} from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import MetadataRequestWindow from './MetadataRequestWindow';

export default class MovieTile extends React.Component{

    state = {'errorState': false, 'message': '', 'askForMeta': false}

    constructor(props){
        super(props);
        this.onErrorClosed = this.onErrorClosed.bind(this);
        this.downloadWithMeta = this.downloadWithMeta.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.download = this.download.bind(this);
        this.downloadButtonPressed = this.downloadButtonPressed.bind(this);
    }

    downloadWithMeta(showName, seasonNumber){
        this.download(this.props.path + "tv/" + showName + "/" + seasonNumber + "/")
        this.setState({'askForMeta': false});
    }

    cancelModal(){
        this.setState({'askForMeta': false});
    }

    download(path){
        console.log('Submitting download to path: ' + path);
        fetch(process.env.REACT_APP_DLAPI_LINK + 'api/v1/content', {
            method: 'post',
            headers: new Headers({
                'Authorization': process.env.REACT_APP_DLAPI_API_KEY
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
            this.setState({'askForMeta': true});
            return;
        }else{
            this.download(this.props.path + 'movies/')
        }
    }

    onErrorClosed(){
        this.setState({'errorState': false});
    }


    render(){
        var meta;
        if(this.state.askForMeta){
            meta = (<MetadataRequestWindow downloadWithMeta={this.downloadWithMeta} cancelModal={this.cancelModal}/>);
        }

        var errorBubble;
        if(this.state.errorState){
            errorBubble = (<ErrorMessage title="Error Downloading Movie" message={this.state.message} onClosed={this.onErrorClosed}/>)
        }

        return (
            <>
                {errorBubble}
                {meta}
                <Button variant="secondary" size="lg" block onClick={this.downloadButtonPressed}>
                    <h4>{this.props.title}</h4>
                    <a href={this.props.link}>Direct URL</a>
                    <p>Seeders: {this.props.seeders}</p>
                </Button>
            </>
        );
    }
}