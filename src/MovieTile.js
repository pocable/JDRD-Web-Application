import React from 'react';
import {Button} from 'react-bootstrap';

export default class MovieTile extends React.Component{

    state = {'title': 'Missing Title Data', 'seeders': '128', 'link': 'magnet:?xt=urn:btih:add4f96bc50daf48572bbd213928df41a8328727&dn=Tremors.3.Ritorno.A.Perfection.(2001).1080p.H264.Ita.Eng.Ac3.Sub.Ita.NUEng-MIRCrew.mkv&xl=3395915170&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.torrent.eu.org:451/announce&tr=udp://tracker.pirateparty.gr:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.leechers-paradise.org:6969/announce&tr=udp://tracker.eddie4.nl:6969/announce&tr=udp://shadowshq.yi.org:6969/announce&tr=udp://shadowshq.eddie4.nl:6969/announce&tr=udp://inferno.demonoid.pw:3391/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://9.rarbg.to:2730/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://9.rarbg.me:2780/announce&tr=udp://62.138.0.158:6969/announce&tr=udp://151.80.120.114:2710/announce'}
    DEFAULT_PATH = "/media/noPathSet/"

    constructor(props){
        super(props);
        this.downloadMovie = this.downloadMovie.bind(this);
    }

    downloadMovie(){
        fetch('http://192.168.0.38:4248/api/v1/content', {
            method: 'post',
            headers: new Headers({
                'Authorization': 'ccbce173ee8b1e0ad838dc4198ee15ff9f0b0e1cfe07f964201cab0a11b4e9e8',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'magnet_url': this.state.link,
                'title': this.state.title,
                'path': this.DEFAULT_PATH
            })
            }).then(response => {
                console.log(response.status);
                console.log(response);
        });
    }


    render(){
        return (
            <div className="movieTile">
                <Button variant="secondary" onClick={this.downloadMovie}>
                    <h4>{this.state.title}</h4>
                    <p>{this.state.seeders}</p>
                </Button>
            </div>
        );
    }
}