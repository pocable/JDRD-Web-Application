import React from 'react';
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap';
import {FaCloudDownloadAlt} from 'react-icons/fa'
import DownloadConfirmation from './DownloadConfirmation';


/**
 * An object representing a movie, currently a button.
 * Responsible for submitting a download and visualizing a movie.
 */
export default class MovieTile extends React.Component{

    state = {'askForMeta': false, 'confirmState': false, 'confirmMessage': '', 'metadata': this.extractMetaData()}

    static propTypes = {
        /** The main download location path (contains subfolders tv and movies). */
        path: PropTypes.string,

        /** The URL/magnet link of the show. */
        link: PropTypes.string,

        /** The title of the show. */
        title: PropTypes.string,

        /** The number of people currently seeding the torrent. */
        seeders: PropTypes.number,

        /** The number of people currently leeching the torrent. */
        leechers: PropTypes.number,
        
        /** If the displayed item is a TV show or not. */
        isTV: PropTypes.bool,

        /** On Error call for if there is an issue. */
        onError: PropTypes.func
    }

    constructor(props){
        super(props);
        this.cancelModal = this.cancelModal.bind(this);
        this.download = this.download.bind(this);
        this.downloadButtonPressed = this.downloadButtonPressed.bind(this);
        this.extractMetaData = this.extractMetaData.bind(this);
    }

    /**
     * Close the ask for metadata modal.
     */
    cancelModal(){
        this.setState({'confirmState': false});
    }

    /**
     * Submit the URL prop for downloading on DLAPI to the path provided.
     * @param {string} path The path provided to download to. 
     */
    download(path){
        var error = false;
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
                error = true;
            }
            return response.json()
        }).then(data => {
            if(data === JSON.stringify({})){
                console.error(data);
                this.props.onError('Error with Item', 'Failed to convert the movie to JSON. This could be the sign of an incorrect jackett setup. Try another torrent or check your torrents.')
            }
            if(error === true){
                this.props.onError('Error with Item', 'Error returned from DLAPI\n' + data["Error"])
            }
        }).catch(exp => {
            console.error(exp);
            this.props.onError('Error with Item', 'Failed to fetch from DLAPI. DLAPI could be down or the Jackett endpoint does not work. Check console for detailed information.')
        })
        this.setState({'confirmState': false})
    }

    /**
     * Try and extract metadata from the title to place it in a proper folder
     * @returns boolean if sucessful
     */
    extractMetaData(){
        const ptt = require("parse-torrent-title");
        const information = ptt.parse(this.props.title);
        let metaInfo = {title: information.title, year: information.year, season: information.season}
        return metaInfo;
    }

    /**
     * Called when the download button is pressed
     */
    downloadButtonPressed(){
        this.setState({'confirmState': true});
    }


    render(){

        // Can use same var since if its TV it will metadata request else if its a movie its a confirm window.
        var popup;
        if(this.state.confirmState){
            popup = (<DownloadConfirmation download={this.download} cancelModal={this.cancelModal} isTV={this.props.isTV} title={this.state.metadata.title} year={this.state.metadata.year} season={this.state.metadata.season}
            path={this.props.path}/>);
        }

        return (
            <>
                <tr>
                    {popup}
                    <td className="MovieTitle">
                        {this.props.title.replaceAll(".", " ")}
                    </td>
                    <td>
                        {this.props.seeders}
                    </td>
                    <td>
                        {this.props.leechers}
                    </td>
                    <td>
                        <Button variant="secondary" block onClick={this.downloadButtonPressed} title={this.props.title}><FaCloudDownloadAlt/></Button>
                    </td>
                </tr>
            </>
        );
    }
}
