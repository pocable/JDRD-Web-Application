import React from 'react';
import {Form, Button, ButtonToolbar} from 'react-bootstrap';
import MovieTile from './MovieTile'

export default class JackettSearch extends React.Component{

    // TODO: Stop button from refreshing the page.

    state = {'searchResults': [], 'formSearchQuery': '', 'searchDisabled': false, 'tvCheckbox': 'off', 'movieCheckbox': 'on'}
    tvCategories = [5000,5010,5030,5040,5045,5050,5060,5070,5080];
    movieCategories = [2000,2010,2020,2030,2040,2045,2050,2060,2070,2080];

    constructor(props){
        super(props);
        this.searchJackett = this.searchJackett.bind(this);
        this.updateText = this.updateText.bind(this);
        this.toggleTvCheckbox = this.toggleTvCheckbox.bind(this);
        this.toggleMovieCheckbox = this.toggleMovieCheckbox.bind(this);
    }


    // TODO: Search jackett for the information like DLAPI
    searchJackett(event){
        // Change to template string
        event.preventDefault();
        console.log(this.state);
        this.setState({'searchDisabled': true});

        var chosenCategories = [];
        if(this.state.movieCheckbox === 'on'){ chosenCategories = chosenCategories.concat(this.movieCategories);}
        if(this.state.tvCheckbox === 'on'){ chosenCategories = chosenCategories.concat(this.tvCategories);}


        var api_key = "jeancf9pxd5jqy8mpwe6k2b2gz9dnio8";
        var limit = 300;
        var link = `http://192.168.0.38:9117/api/v2.0/indexers/ettv/results/torznab?apikey=${api_key}&cat=${chosenCategories.join(',')}&t=search&limit=${limit}&q=${encodeURIComponent(this.state.formSearchQuery)}`;
        fetch(link).then(response => {
            console.log(response.status);
            return response.text();
        }).then(str => {
            return (new window.DOMParser()).parseFromString(str, "text/xml");
        }).then(data => {
            var searchResults = []
            for(let item of data.getElementsByTagName('item')){
                var title = item.getElementsByTagName('title')['0'].innerHTML;
                var link = item.getElementsByTagName('link')['0'].innerHTML;
                var seeders = item.querySelector('[name=seeders]').getAttribute('value');
                searchResults.push(<MovieTile key={title} isTV={this.state.tvCheckbox === 'on'} link={link} title={title} seeders={seeders} path={"/media/"}/>);
            }
            searchResults = searchResults.sort(function(a, b){ return a.props.seeders - b.props.seeders; }).reverse();
            this.setState({'searchDisabled': false, 'searchResults': searchResults});
        });
    }

    toggleTvCheckbox(event){
        this.setState({'tvCheckbox': 'on', 'movieCheckbox': 'off'});
    }

    toggleMovieCheckbox(event){
        this.setState({'movieCheckbox': 'on', 'tvCheckbox': 'off'});
    }

    updateText(event){
        this.setState({'formSearchQuery': event.target.value});
    }

    render(){
        return (
            <div className="jackettsearch">
                <Form onSubmit={this.searchJackett}>
                    <Form.Group controlId="basicSearch">
                        <Form.Control plaintext autoComplete="off" value={this.state.formSearchQuery} onChange={this.updateText}  placeholder="Enter a movie or tv show name" />
                    </Form.Group>
                    <fieldset>
                        <Form.Group>
                            <Form.Check inline type="radio" name="formHor" defaultChecked onChange={this.toggleMovieCheckbox} label="Movie" />
                            <Form.Check inline type="radio" name="formHor" onChange={this.toggleTvCheckbox} label="TV Show" />
                        </Form.Group>
                    </fieldset>
                    <Button variant="primary" type="submit" disabled={this.state.searchDisabled}>
                        Submit
                    </Button>
                </Form>
                <br></br>
                <ButtonToolbar vertical={1}>
                    {this.state.searchResults}
                </ButtonToolbar>
            </div>
        );
    }

}