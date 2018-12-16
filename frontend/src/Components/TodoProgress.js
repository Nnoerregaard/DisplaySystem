
import React, { Component } from 'react';
import Websocket from 'react-websocket';
import rd3 from 'rd3';
import _ from 'underscore';

class TodoProgress extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleMessages(message){
    var jsonData = JSON.parse(message);
    switch(jsonData.type){
      case "IdentityUpdate":
        this.updateIdentity(jsonData);
        break;
      case "Data":
        this.handleData(jsonData);
        break;
      default:
        console.log("Unknown message type received!");
        break;
    }

  }

  handleData(jsonData){
    //Only update if there is something new
    if (!_.isEqual(this.state.networkData, jsonData)){
      //If this is the target cluster, update the values
      if (this.props.identity === jsonData.targetCluster) {
        this.setValueForAddTokens(jsonData.numberOfAddTokens);
        this.setPosition(jsonData.position)

        this.setState({ networkData: jsonData });
      }
    }
  }

  updateIdentity(jsonIdentityUpdate){
    this.setState({identity: jsonIdentityUpdate.identity});
  }

  convertToLocalCoordinateSystem(position){
    /* NB! Be aware that these change if you change 
    * the size of the visualization or want to change
    * where it appears relative to the referent */
    var xWorldToLocalConversionFactor = 230;
    var yWorldToLocalConversionFactor = 286;

    return {x : (position.x * xWorldToLocalConversionFactor) - 161,
            y : (position.y * yWorldToLocalConversionFactor) - 28 };
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default WhatIf;
