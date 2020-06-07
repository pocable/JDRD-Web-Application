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
        fetch('http://192.168.0.38:4248/api/v1/content/all', {
            method: 'get',
            headers: new Headers({
                'Authorization': 'ccbce173ee8b1e0ad838dc4198ee15ff9f0b0e1cfe07f964201cab0a11b4e9e8',
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