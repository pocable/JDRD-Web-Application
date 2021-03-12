import React from 'react';
import {Button, Form} from 'react-bootstrap';
import PropTypes from 'prop-types'
import {Card} from 'react-bootstrap';


export default class LoginWindow extends React.Component{

    state = {userpass: '', incorrectPassText: false, errorMessage: "", loginDisabled: false}

    static propTypes = {
        /** The callback for when a login is good! Will send back api key and data. */
        loginCallback: PropTypes.func,
    }


    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onAPIKeyChanged = this.onAPIKeyChanged.bind(this);
    }

    onSubmit(e){
        e.preventDefault();
        this.setState({loginDisabled: true});
        // Try to authenticate with the server
        fetch(window._env_.REACT_APP_DLAPI_LINK + 'api/v1/authenticate', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                'userpass': this.state.userpass
            })
            }).then(response => {
                if((!response.ok)){ 
                    throw new Error(response.status);
                }
                return response.json();
            }).then(data => {
                this.setState({loginDisabled: false});
                this.props.loginCallback(data['token']);
            }).catch(exp => {
                if(exp.message === "429"){
                    this.setState({incorrectPassText: true, errorMessage: "Rate limited. Please try again later.", loginDisabled: false});
                }else if (exp.message === "401"){
                    this.setState({incorrectPassText: true, errorMessage: "Incorrect login provided.", loginDisabled: false});
                }else if (exp.message === "400"){
                    this.setState({incorrectPassText: true, errorMessage: "Invalid input. Check console for details.", loginDisabled: false});
                }else{
                    this.setState({incorrectPassText: true, errorMessage: "Failed to connect to DLAPI.", loginDisabled: false});
                }
                console.error(exp)
                this.setState({loginDisabled: false});
            });;
    }

    onAPIKeyChanged(event){
        this.setState({'userpass': event.target.value})
    }

    render(){
        return (
            <div className="LoginWindow">
                <Card style={{height: '14rem', maxWidth: '30rem', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Card.Body>
                        <Card.Title>Login Required</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Enter your DLAPI User Key or API Key</Card.Subtitle>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group controlId="text">
                                <input name="pass" type="password" className="form-control" placeholder="User Key / API Key" value={this.state.apiKey} onChange={this.onAPIKeyChanged} autoComplete="off"/>
                            </Form.Group>
                            {this.state.incorrectPassText && <p style={{color: "red"}}>{this.state.errorMessage}</p>}
                            <Button variant="success" onClick={this.onSubmit} disabled={this.state.loginDisabled} style={{position: "absolute", bottom: "10px", marginLeft: "auto", marginRight: "auto", left: 0, right: 0, textAlign: "center"}}>Login</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}