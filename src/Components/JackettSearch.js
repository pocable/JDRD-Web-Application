import React from 'react';
import {Form, Button} from 'react-bootstrap';
import MovieTile from './MovieTile'
import PropTypes from 'prop-types'

/**
 * A form which searches jackett and puts the results into a button toolbar
 */
export default class JackettSearch extends React.Component{

    static propTypes = {
        /** 
         * Callback function for when json has been retrieved from jackett.
         * @see App
         */
        jsonCallback: PropTypes.func,
        tvCallback: PropTypes.func
    }

    state = {'formSearchQuery': '', 'searchDisabled': false, 'tvCheckbox': 'off', 'movieCheckbox': 'on', 'unrestrictCheckbox': 'off'}
    
    // These categories are according to jackett and other torrenting websites.
    tvCategories = [5000,8000,8010];
    movieCategories = [2000];

    // This is every single category in jackett.
    unrestrictCategories = [1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 1110, 1120, 1130, 
        1140, 1180, 2000, 2010, 2020, 2030, 2040, 2045, 2050, 2060, 2070, 2080, 3000, 3010, 3020, 3030, 3040, 
        3050, 3060, 4000, 4010, 4020, 4030, 4040, 4050, 4060, 4070, 5000, 5010, 5020, 5030, 5040, 5045, 5050, 
        5060, 5070, 5080, 6000, 6010, 6020, 6030, 6040, 6045, 6050, 6060, 6070, 6080, 6090, 7000, 7010, 7020, 
        7030, 7040, 7050, 7060, 8000, 8010, 8020, 100000]

    constructor(props){
        super(props);
        this.searchJackett = this.searchJackett.bind(this);
        this.updateText = this.updateText.bind(this);
        this.toggleTvCheckbox = this.toggleTvCheckbox.bind(this);
        this.toggleMovieCheckbox = this.toggleMovieCheckbox.bind(this);
        this.toggleUnrestrictCheckbox = this.toggleUnrestrictCheckbox.bind(this);
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
        if(this.state.unrestrictCheckbox === 'on'){ chosenCategories = chosenCategories.concat(this.unrestrictCategories);}

        var query_url = window._env_.REACT_APP_DLAPI_LINK + "api/v1/jackett/search?query=" + encodeURIComponent(this.state.formSearchQuery) + "&categories=" + chosenCategories.join(',');
        // Contact DLAPI to search jackett. Removes the API keys from the front of the software.
        fetch(query_url, {
            headers: new Headers({
                'Authorization': window._env_.REACT_APP_DLAPI_API_KEY,
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.props.jsonCallback(data['Results']);
            this.setState({'searchDisabled': false});
        });
    }

    toggleTvCheckbox(){
        this.setState({'tvCheckbox': 'on', 'movieCheckbox': 'off', 'unrestrictCheckbox' : 'off'});

        // Clear current search results and set to tv.
        this.props.jsonCallback([]);
        this.props.tvCallback(true);
    }

    toggleMovieCheckbox(){
        this.setState({'movieCheckbox': 'on', 'tvCheckbox': 'off', 'unrestrictCheckbox' : 'off'});

        // Clear current search results and set to non tv.
        this.props.jsonCallback([]);
        this.props.tvCallback(false);
    }

    toggleUnrestrictCheckbox(){
        this.setState({'movieCheckbox': 'off', 'tvCheckbox': 'off', 'unrestrictCheckbox' : 'on'});

        // Clear current search results and set to non tv.
        this.props.jsonCallback([]);
        this.props.tvCallback(false);
    }

    updateText(event){
        this.setState({'formSearchQuery': event.target.value});
    }

    render(){

        // Render the no filter checkbox if its configured to show
        var nofilter;
        if (window._env_.REACT_APP_ALLOW_NO_FILTER !== undefined && window._env_.REACT_APP_ALLOW_NO_FILTER.toLowerCase() === "true"){
            nofilter = <Form.Check inline type="radio" name="formHor" onChange={this.toggleUnrestrictCheckbox} label="No Filter" />
        }

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
                            {nofilter}
                        </Form.Group>
                    </fieldset>
                    <Button variant="primary" type="submit" disabled={this.state.searchDisabled}>
                        Submit
                    </Button>
                </Form>
                <br></br>
            </div>
        );
    }

}