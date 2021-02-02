
import React from 'react';
import PropTypes from 'prop-types'
import {Table, Pagination} from 'react-bootstrap';
import MovieTile from './MovieTile'

/**
 * Box for containing the search results from JackettSearch
 * @see JackettSearch
 * @version 1.0.0
 */
export default class SearchResultBox extends React.Component{

    static propTypes = {
        /** 
         * A list of MovieTile objects.
         * @see MovieTile
         */
        jackettJson: PropTypes.array,
        promptTV: PropTypes.bool
    }

    state = {pageIndex: 0, lastPropLength: 0, allTiles: []}

    maxDisplaySize = 50;
    maxPaginationSize = 10;

    constructor(props){
        super(props);
        this.buildTiles = this.buildTiles.bind(this);
        this.onPageinationChange = this.onPageinationChange.bind(this);
        this.onPageinationNext = this.onPageinationNext.bind(this);
        this.onPageinationPrevious = this.onPageinationPrevious.bind(this);
    }

    componentDidUpdate(){
        if (this.props.jackettJson.length !== this.state.lastPropLength) {
            this.setState({pageIndex: 0, lastPropLength: this.props.jackettJson.length, allTiles: this.buildTiles()})
        }
    }

    buildTiles(){
        var searchResults = []
        if (this.props.jackettJson.length === 0){ return [];}


        for(var i = 0; i < this.props.jackettJson.length; i++){
            var item = this.props.jackettJson[i];
            searchResults.push(<MovieTile key={i} isTV={this.props.promptTV} link={item['Link']} title={item['Title']} seeders={item['Seeders']} leechers={item['Peers']} path={"/media/"}/>);
        }

        searchResults = searchResults.sort(function(a, b){ return a.props.seeders - b.props.seeders; }).reverse();
        return searchResults;
    }


    onPageinationChange(event){
        if(event.target.text !== undefined){
            this.setState({pageIndex: event.target.text - 1});
        }
    }

    onPageinationPrevious(){
        if(this.state.pageIndex !== 0){
            this.setState({pageIndex: this.state.pageIndex - 1});
        }
    }

    onPageinationNext(){
        var numberItems = Math.ceil(this.props.jackettJson.length / this.maxDisplaySize);
        if(this.state.pageIndex < Math.min(this.maxPaginationSize, numberItems) - 1){
            this.setState({pageIndex: this.state.pageIndex + 1});
        }
    }




    render(){
        var visibleTiles;
        var numberItems = 0;
        if(this.props.jackettJson === undefined){
            visibleTiles = [];
        }else{
            visibleTiles = this.state.allTiles.slice(this.maxDisplaySize * this.state.pageIndex, Math.min(this.maxDisplaySize * (this.state.pageIndex + 1), this.props.jackettJson.length));
            numberItems = Math.ceil(this.props.jackettJson.length / this.maxDisplaySize);
        }

        // Build pagination items
        // Elipses can be implemented but torrents will be extremely dead at this point
        var pages = []
        for(var i = 0; i < Math.min(this.maxPaginationSize, numberItems); i++){
            if(i === this.state.pageIndex){
                pages.push(<Pagination.Item onClick={this.onPageinationChange} active key={i}>{i + 1}</Pagination.Item>); 
            }else{
                pages.push(<Pagination.Item onClick={this.onPageinationChange} key={i}>{i + 1}</Pagination.Item>); 
            }
        }

        if(this.state.allTiles.length === 0){
            return ( <></> );
        }
        return (
            <div className="BorderBox">
                <Pagination size='sm'>
                    <Pagination.Prev onClick={this.onPageinationPrevious}/>
                    {pages}
                    <Pagination.Next onClick={this.onPageinationNext}/>
                </Pagination>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Torrent Name</th>
                            <th>Seeders</th>
                            <th>Leechers</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleTiles}
                    </tbody>
                </Table>
            </div>
        );
    }
}