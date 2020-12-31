
import React from 'react';
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap';

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
            <div className="BorderBox">
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
                        {this.props.tiles}
                    </tbody>
                </Table>
            </div>
        );
    }
}