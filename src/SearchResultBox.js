
import React from 'react';
import PropTypes from 'prop-types'
import {ButtonToolbar} from 'react-bootstrap';

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
        tiles: PropTypes.array,
    }

    render(){
        if(this.props.tiles.length === 0){
            return ( <></> );
        }
        return (
            <ButtonToolbar vertical={1} className='BorderBox'>
                {this.props.tiles}
            </ButtonToolbar>
        );
    }
}