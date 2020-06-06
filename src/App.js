import React from 'react';
import './App.css';
import CurrentlyDownloading from './CurrentlyDownloading.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieTile from './MovieTile';

export default class App extends React.Component{

  render(){
    return (
      <div className="App">
        <CurrentlyDownloading />
      </div>
    );
  }
}
