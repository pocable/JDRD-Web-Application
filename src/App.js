import React from 'react';
import './App.css';
import CurrentlyDownloading from './CurrentlyDownloading.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import JackettSearch from './JackettSearch';
import {Container, Row, Col} from 'react-bootstrap';

/**
 * Entrypoint for JDRD web. Overall page formatting is declared here.
 * @version 1.0.0
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
