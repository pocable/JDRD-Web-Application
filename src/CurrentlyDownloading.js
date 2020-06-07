import React from 'react';
import {Card, ListGroup} from 'react-bootstrap';
import CurrentDownloadListItem from './CurrentDownloadListItem';


export default class CurrentlyDownloading extends React.Component{

      
    state = {'curDownload': []}

    constructor(props){
        super(props);
        this.getCurrentDownloads = this.getCurrentDownloads.bind(this);
    }

    componentDidMount(){
        this.getCurrentDownloads();
        setInterval(async () => {
            this.getCurrentDownloads();
        }, 5000);
    }

    getCurrentDownloads(){
        fetch(process.env.REACT_APP_DLAPI_LINK + 'api/v1/content/all', {
            method: 'get',
            headers: new Headers({
                'Authorization': process.env.REACT_APP_DLAPI_API_KEY,
                'Content-Type': 'application/json'
            })
            }).then(response => {
                return response.json();
            }).then(data => {
                var items = []
                for(var x in data){
                    items.push((<CurrentDownloadListItem key={x} rdid={x} title={data[x]['title']} path={data[x]['path']}/>))
                }
                this.setState({'curDownload': items});
            }
        );
    }

    render(){
        return (
            <div className='CurrentDownloads'>
                <Card>
                    <Card.Header>
                        Current RealDebrid Downloads
                    </Card.Header>
                    <ListGroup variant="flush">
                        {this.state.curDownload}
                    </ListGroup>
                </Card>
            </div>
        );
    }
}