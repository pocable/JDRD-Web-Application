import React from 'react';
import {Form, Button} from 'react-bootstrap';

export default class JackettSearch extends React.Component{

    // TODO: Stop button from refreshing the page.

    state = {'searchResults': []}

    constructor(props){
        super(props);
        this.searchJackett = this.searchJackett.bind(this);
    }


    // TODO: Search jackett for the information like DLAPI
    searchJackett(){

    }

    render(){
        return (
            <div className="jackettsearch">
                <Form>
                    <Form.Group controlId="basicSearch">
                        <Form.Label>Search</Form.Label>
                        <Form.Control type="text" placeholder="Enter a movie or tv show name" />
                    </Form.Group>
                    <Form.Group controlId="tvMovieSelector">
                        <Form.Check inline type="checkbox" label="Movie" />
                        <Form.Check inline type="checkbox" label="TV" />

                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>      
            </div>
        ); // ADD Internal Container (I think default should be fine with zero row/col)
    }

}