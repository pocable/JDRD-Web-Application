import React from 'react';
import {Table} from 'react-bootstrap';
import CurrentDownloadListItem from './CurrentDownloadListItem';
import ErrorMessage from './ErrorMessage';

/**
 * List display of items currently being downloaded by DLAPI.
 * @see CurrentDownloadListItem
 * @version 1.0.1
 */
export default class CurrentlyDownloading extends React.Component{

      
    state = {'curDownload': [], 'errorState': false, 'errorMessage': ''}

    constructor(props){
        super(props);

        this.interval = 0
        this.getCurrentDownloads = this.getCurrentDownloads.bind(this);
        this.onErrorClosed = this.onErrorClosed.bind(this);
    }

    // When mounted, constantly update the current downloads every 5000 seconds.
    componentDidMount(){
        this.getCurrentDownloads();
        this.interval = setInterval(async () => {
            this.getCurrentDownloads();
        }, 5000);
    }


    // On the error window closed
    onErrorClosed(){
        this.setState({'errorState': false})
    }

    // Prevent memory leaks
    componentWillUnmount(){
        clearInterval(this.interval)
    }

    /**
     * Get a list of items DLAPI is currently processing for download
     */
    getCurrentDownloads(){
        fetch(window._env_.REACT_APP_DLAPI_LINK + 'api/v1/content/all', {
            method: 'get',
            headers: new Headers({
                'Authorization': window._env_.REACT_APP_DLAPI_API_KEY,
                'Content-Type': 'application/json'
            })
            }).then(response => {
                if((!response.ok)){ throw new Error('Webpage reported 404, check console for URL.'); }
                return response.json();
            }).then(data => {
                var items = []
                for(var x in data){
                    items.push((<CurrentDownloadListItem key={x} rdid={x} title={data[x]['title']} path={data[x]['path']}/>))
                }
                this.setState({'curDownload': items});
            }).catch(exp => {

                // Issue polling server, clear interval and report error.
                console.error(exp)
                this.setState({'errorState': true, 'errorMessage': 'DLAPI may be offline or inaccessible. Double check that "' + window._env_.REACT_APP_DLAPI_LINK + 'api/v1/content/all" is a valid URL to DLAPI.'})
                clearInterval(this.interval)
            });
    }

    render(){
        var errorBubble;
        if(this.state.errorState){
            errorBubble = (<ErrorMessage title="Error Polling DLAPI for Downloads" message={this.state.errorMessage} onClosed={this.onErrorClosed}/>)
        }

        return (
            <div className='CurrentDownloads'>
                {errorBubble}
                <div className="BorderBox">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan="3">
                                    Currently Tracked Items
                                </th>
                            </tr>
                            <tr>
                                <th>Torrent Name</th>
                                <th>Location</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.curDownload.length === 0 && <tr><td colSpan="3">There are no items downloading.</td></tr>}
                            {this.state.curDownload}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}