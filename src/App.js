import React from 'react';
import './App.css';
import CurrentlyDownloading from './CurrentlyDownloading.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import JackettSearch from './JackettSearch';
import {Container, Row, Col} from 'react-bootstrap';

/*
Currently Downloading list works good.
TODO: work on a search button with a child of a grid which holds each search result.
Each search result has a title, seeders and maybe more information from jackett ?? (see API)
Each item will have a button to download. Each item will look like a card. Use movie Tile.

*/

export default class App extends React.Component{

  render(){
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
            <h1>JDRD Web Downloader</h1>
            <br></br>
            </Col>
          </Row>
          <Row>
            <Col>
              <CurrentlyDownloading />
            </Col>
            <Col>
              <JackettSearch />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
