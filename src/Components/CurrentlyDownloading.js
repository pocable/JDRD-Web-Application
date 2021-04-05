import React from 'react';
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap';
import CurrentDownloadListItem from './CurrentDownloadListItem';

/**
 * List display of items currently being downloaded by DLAPI.
 * @see CurrentDownloadListItem
 * @version 1.0.1
 */
export default class CurrentlyDownloading extends React.Component{

      
    state = {'curDownload': []}

    static propTypes = {

        /** Function called when there is an error loading. */
        onError: PropTypes.func
    }

    constructor(props){
        super(props);

        this.interval = 0
        this.getCurrentDownloads = this.getCurrentDownloads.bind(this);
    }

    // When mounted, constantly update the current downloads every 5000 seconds.
    componentDidMount(){
        this.getCurrentDownloads();
        this.interval = setInterval(async () => {
            this.getCurrentDownloads();
        }, 5000);
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
        }).catch(_ => {
            this.props.onError('Failed to Connect', 'DLAPI could not be reached to update currently downloading list. Please try again later.')

        });
    }

    render(){

        return (
            <div className='CurrentDownloads'>
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