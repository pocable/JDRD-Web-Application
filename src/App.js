import React from 'react';
import './App.css';
import CurrentlyDownloading from './CurrentlyDownloading.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import JackettSearch from './JackettSearch';
import {Container, Row, Col, Navbar, Button, Nav} from 'react-bootstrap';
import {getCookie, setCookie, deleteCookie} from './CookieLib';
import LoginWindow from './LoginWindow.js';

/**
 * Entrypoint for JDRD web. Overall page formatting is declared here.
 * @version 1.0.1
 */
export default class App extends React.Component{


  constructor(props){
    super(props);

    // Check if cookie exists
    var intstate = {reqUpdate: false}

    var api_key = getCookie("DLAPI_KEY");
    if (api_key === ""){
      intstate = {reqUpdate: true}
    }
    
    window._env_.REACT_APP_DLAPI_API_KEY = api_key;
    this.state = intstate;
    this.loginCallback = this.loginCallback.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
  }

  componentDidMount(){

    // Check if the token is valid from the constructor.
    fetch(window._env_.REACT_APP_DLAPI_LINK + 'api/v1/authenticate/validtoken', {
      method: 'post',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          'token': window._env_.REACT_APP_DLAPI_API_KEY
      })
      }).then(response => {
          if((!response.ok)){ this.setState({reqUpdate: true}); console.log();}
          return response.json();
      }).then(data => {
        if(!data['is_valid']){
          deleteCookie("DLAPI_KEY");
          this.setState({reqUpdate: true})
          console.log("Authentication failed. Re-enter user password.");
        }else{
          console.log("Authentication successful.");
        }
      })
  }


  loginCallback(token){
    window._env_.REACT_APP_DLAPI_API_KEY = token;
    // Update Cookies
    setCookie('DLAPI_KEY', token, 365);

    // Update state for update.
    this.setState({reqUpdate: false});
  }

  deleteSession(){
    deleteCookie("DLAPI_KEY");
    this.setState({reqUpdate: true});

    // Tell DLAPI to delete session
    fetch(window._env_.REACT_APP_DLAPI_LINK + 'api/v1/authenticate/closesession', {
      method: 'post',
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
          'token': window._env_.REACT_APP_DLAPI_API_KEY
      })
    })
  }

  render(){
    var logoutButton;
    if(!this.state.reqUpdate){
      logoutButton = (
        <Navbar.Collapse>
          <Nav className="justify-content-end" style={{width: "100%"}}>
            <Button variant="warning" onClick={this.deleteSession}>Logout Session</Button>
          </Nav>
        </Navbar.Collapse>
      )
    }
    var navbar = (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>JDRD Web Downloader</Navbar.Brand>
        <Navbar.Toggle />
        {logoutButton}
      </Navbar>
    );

    if(this.state.reqUpdate){
      return(
        <div className="App">
          {navbar}
          <Container fluid style={{paddingTop: "10px"}}>
            <Row>
              <Col>
                <LoginWindow loginCallback={this.loginCallback}/>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    return (
      <div className="App">
        {navbar}
        <Container fluid style={{paddingTop: "10px"}}>
          <Row>
            <Col md>
              <CurrentlyDownloading />
              <br></br>
            </Col>
            <Col md> 
              <JackettSearch />
            </Col>
          </Row>
          
        </Container>
      </div>
    );
  }
}
