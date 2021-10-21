import React from 'react';
import './App.css';
import DownloadMonitor from './Components/DownloadMonitor';
import 'bootstrap/dist/css/bootstrap.min.css';
import JackettSearchbox from './Components/JackettSearchbox';
import {Container, Row, Col, Navbar, Button, Nav} from 'react-bootstrap';
import {getCookie, setCookie, deleteCookie} from './Utils/CookieLib';
import LoginWindow from './Components/LoginWindow';
import SearchResultBox from './Components/SearchResultBox';
import ErrorMessage from './Components/ErrorMessage';

/**
 * Entrypoint for JDRD web. Overall page formatting is declared here.
 */
export default class App extends React.Component{


    state = {reqUpdate: false, searchJson: [], promptTV: false, errorState: false, errorTitle: '', errorMessage: ''}

    constructor(props){
        super(props);

        // Check if cookie exists
        var api_key = getCookie("DLAPI_KEY");   
        window._env_.REACT_APP_DLAPI_API_KEY = api_key;
        this.state.reqUpdate = (api_key === "");
        this.loginCallback = this.loginCallback.bind(this);
        this.deleteSession = this.deleteSession.bind(this);
        this.updateJackettData = this.updateJackettData.bind(this);
        this.updatePromptTV = this.updatePromptTV.bind(this);
        this.closeErrorWindow = this.closeErrorWindow.bind(this);
        this.errorCallback = this.errorCallback.bind(this);
    }

    /**
     * Goal here is to check if the token is still valid. If it isn't, load
     * the login screen and clear the cookie we have stored.
     */
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
            if((!response.ok)){ this.setState({reqUpdate: true}); }
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

    /**
     * General error catching, just display a window so its easier for the user to report.
     */
    componentDidCatch(error, info){
        this.setState({errorState: true, errorTitle: error, errorMessage: info})
    }

    /**
     * Function to display an error box. 
     * If there is the chance of a failure in a child this should be passed through.
     * @param {The error message, is the window title.} error 
     * @param {Information about the error, displayed in the body of the modal.} info 
     */
    errorCallback(error, info){
        
        // There is legit one case where we need to clear the session. Might as well do it here.
        if(info === "DLAPI could not be reached to update currently downloading list. Please try again later."){
            this.deleteSession()
        }

        this.setState({errorState: true, errorTitle: error, errorMessage: info})
    }


    /**
     * Callback function to handle when a successful login occurs.
     * This updates the display to show the main application and saves the cookie.
     * @param {The token recieved from DLAPI} token 
     */
    loginCallback(token){
        window._env_.REACT_APP_DLAPI_API_KEY = token;
        // Update Cookies
        setCookie('DLAPI_KEY', token, 365);

        // Update state for update.
        this.setState({reqUpdate: false});
    }

    /**
     * Logout function, deletes the cookie key and tells DLAPI to delete the session key.
     */
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

    /**
     * Sets the state given the recieved data.
     * @param {The search data recieved from JackettSearchbox} data 
     */
    updateJackettData(data){
        this.setState({searchJson: data});
    }

    /**
     * Sets if we need to prompt for a TV download (ask for more metadata)
     * @param {True or false boolean} data 
     */
    updatePromptTV(data){
        this.setState({promptTV: data});
    }

    /**
     * Close the error window.
     */
    closeErrorWindow(){
        this.setState({errorState: false})
    }

    render(){

        // Only put the navbar out here to make it clearer to notice.
        var navbar = (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>JDRD Web Downloader</Navbar.Brand>
                <Navbar.Toggle />
                {!this.state.reqUpdate &&
                    <Navbar.Collapse>
                        <Nav className="justify-content-end" style={{width: "100%"}}>
                        <Button variant="warning" onClick={this.deleteSession}>Logout Session</Button>
                        </Nav>
                    </Navbar.Collapse>
                }
            </Navbar>
        );
        
        // Error window to display errors if we are in the error state
        var errorWindow;
        if (this.state.errorState){
            errorWindow = (<ErrorMessage title={this.state.errorTitle} message={this.state.errorMessage} onClosed={this.closeErrorWindow}/>)
        }

        // Display the main app menu
        return (
            <div className="App">
                {navbar}
                {errorWindow}
                <Container fluid style={{paddingTop: "10px"}}>
                    {this.state.reqUpdate 
                    
                        ? // If we require a login, show the login window.

                        <Row>
                            <Col>
                                <LoginWindow loginCallback={this.loginCallback}/>
                            </Col>
                        </Row>

                        : // Else, show the application.

                        <Row>
                            <Col md>
                                <DownloadMonitor onError={this.errorCallback} />
                                <br></br>
                            </Col>
                            <Col md> 
                                <Row>
                                    <Col>
                                    <JackettSearchbox jsonCallback={this.updateJackettData} tvCallback={this.updatePromptTV}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <SearchResultBox jackettJson={this.state.searchJson} promptTV={this.state.promptTV} onError={this.errorCallback}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    }
                </Container>
            </div>
        );
    }
}
