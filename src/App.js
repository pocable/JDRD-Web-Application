import React from 'react';
import './App.css';
import CurrentlyDownloading from './CurrentlyDownloading.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import JackettSearch from './JackettSearch';
import {Container, Row, Col} from 'react-bootstrap';

/*
TODO: CORS issue with Jackett, can add a fix to DLAPI as a proxy or use other
software. DLAPI proxy is probably what I will be doing.
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
