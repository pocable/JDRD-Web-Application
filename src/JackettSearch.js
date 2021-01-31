import React from 'react';
import {Form, Button} from 'react-bootstrap';
import MovieTile from './MovieTile'
import SearchResultBox from './SearchResultBox';

/**
 * A form which searches jackett and puts the results into a button toolbar
 * @version 1.0.1
 */
export default class JackettSearch extends React.Component{

    state = {'searchResults': [], 'formSearchQuery': '', 'searchDisabled': false, 'tvCheckbox': 'off', 'movieCheckbox': 'on'}
    
    // These categories are according to jackett and other torrenting websites.
    // Here we could include anime under tv but I will not be doing that.
    tvCategories = [5000,5010,5030,5040,5045,5050,5060,5070,5080];
    movieCategories = [2000,2010,2020,2030,2040,2045,2050,2060,2070,2080];

    constructor(props){
        super(props);
        this.searchJackett = this.searchJackett.bind(this);
        this.updateText = this.updateText.bind(this);
        this.toggleTvCheckbox = this.toggleTvCheckbox.bind(this);
        this.toggleMovieCheckbox = this.toggleMovieCheckbox.bind(this);
    }

    searchJackett(event){
        // Change to template string
        event.preventDefault();
        this.setState({'searchDisabled': true});

        // If a magnet link is added, do not search and report it.
        if(this.state.formSearchQuery.startsWith("magnet:?")){
            var links = [<MovieTile key='magnet' isTV={false} link={this.state.formSearchQuery} title={'Movie Magnet: ' + this.state.formSearchQuery.substring(20, 60)}  path={"/media/"} />, 
                <MovieTile key='magnet' isTV={true} link={this.state.formSearchQuery} title={'TV Magnet: ' + this.state.formSearchQuery.substring(20, 60)}  path={"/media/"} />]
            this.setState({'searchDisabled': false, 'searchResults': [((this.state.tvCheckbox === 'on') ? links[1] : links[0])]});
            return;
        }

        // Get all of the chosen categories into a list
        var chosenCategories = [];
        if(this.state.movieCheckbox === 'on'){ chosenCategories = chosenCategories.concat(this.movieCategories);}
        if(this.state.tvCheckbox === 'on'){ chosenCategories = chosenCategories.concat(this.tvCategories);}

        // Contact DLAPI to search jackett. Removes the API keys from the front of the software.
        fetch(window._env_.REACT_APP_DLAPI_LINK + "api/v1/jackett/search?query=" + encodeURIComponent(this.state.formSearchQuery) + "&categories=" + chosenCategories.join(','), {
            headers: new Headers({
                'Authorization': window._env_.REACT_APP_DLAPI_API_KEY,
            })
        }).then(response => {
            return response.text();
        }).then(str => {
            return (new window.DOMParser()).parseFromString(str, "text/xml");
        }).then(data => {
            var searchResults = []
            for(let item of data.getElementsByTagName('item')){
                var title = item.getElementsByTagName('title')['0'].innerHTML;
                var link = item.getElementsByTagName('link')['0'].innerHTML;
                var seeders = parseInt(item.querySelector('[name=seeders]').getAttribute('value'));
                var peers = parseInt(item.querySelector('[name=peers]').getAttribute('value'));
                searchResults.push(<MovieTile key={title} isTV={this.state.tvCheckbox === 'on'} link={link} title={title} seeders={seeders} leechers={peers-seeders} path={"/media/"}/>);
            }
            searchResults = searchResults.sort(function(a, b){ return a.props.seeders - b.props.seeders; }).reverse();
            this.setState({'searchDisabled': false, 'searchResults': searchResults});
        });
    }

    toggleTvCheckbox(){
        this.setState({'tvCheckbox': 'on', 'movieCheckbox': 'off'});
    }

    toggleMovieCheckbox(){
        this.setState({'movieCheckbox': 'on', 'tvCheckbox': 'off'});
    }

    updateText(event){
        this.setState({'formSearchQuery': event.target.value});
    }

    render(){
        return (
            <div className="jackettsearch">
                <Form onSubmit={this.searchJackett} className='BorderBox'>
                    <Form.Group controlId="basicSearch">
                        <input name="movieQuery" type="text" className="form-control" placeholder="Enter a movie or tv show name" value={this.state.formSearchQuery} onChange={this.updateText} autoComplete="off" />
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
                <SearchResultBox tiles={this.state.searchResults}/>
            </div>
        );
    }

}