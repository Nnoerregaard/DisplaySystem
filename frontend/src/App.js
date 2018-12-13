import React, { Component } from 'react';
import Websocket from 'react-websocket';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = { dataFromWs: ""};
  }

  handleData(data){
    debugger;
    this.setState({"dataFromWs": data});
  }

  // TODO: Avoid binding this!
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. {this.state.dataFromWs}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React Motherfuck!
          </a>
        <Websocket url="ws://localhost:1336" onMessage={this.handleData.bind(this)} />    
        </header>
      </div>
    );
  }
}

export default App;
