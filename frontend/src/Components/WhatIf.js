import React, { Component } from 'react';
import Websocket from 'react-websocket';
import rd3 from 'rd3';
import _ from 'underscore';

class WhatIf extends Component {
  constructor(props){
    super(props);
    this.state = {
      tokenValue: 5,
      width: 150,
      height: 300,
      xPosition: 0,
      yPosition: 87,
      // First one is x value, the next is y value in the arrays within the array
      data: [
        {
          "name": "North America",
          "values": [[1, 10], [2, 10]]
        },

        {
          "name": "Africa",
          "values": [[1, 0], [2, 0]]
        }
      ],
      networkData: {},
      identity: {}
    };
  }

  handleData(data){
    // TODO: Switch on message type here!
    var jsonData = JSON.parse(data);

    //Only update if there is something new
    if (!_.isEqual(this.state.networkData, jsonData)){

      //Initially just set identity to the first one you encounter. This should change in the future!
      if (_.isEqual(this.state.identity, {})){
        this.setState({identity: jsonData.targetCluster});
      }

      //If this is the target cluster, update the values
      if (_.isEqual(jsonData.targetCluster, this.state.identity)) {
        debugger;
        this.setValueForAddTokens(jsonData.numberOfAddTokens);
        this.setPosition(jsonData.position)

        this.setState({ networkData: jsonData });
      }
    }
  }

  //TODO: This is a special call
  updateIdentity(data){

  }

  // TODO: This can be done way more elegant!
  setValueForAddTokens(numberOfAddTokens){
    this.setState((state, props) => {
      var newData = state.data;
      newData[1]["values"][0][1] = state.tokenValue * numberOfAddTokens;
      newData[1]["values"][1][1] = state.tokenValue * numberOfAddTokens;

      return {data: newData}
    });
  }

  setPosition(position){
    var positionInLocalCoordinates = this.convertToLocalCoordinateSystem(position);
    this.setState({xPosition: positionInLocalCoordinates.x, 
                   yPosition: positionInLocalCoordinates.y})

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
  var AreaChart = rd3.AreaChart;
    return (
      <div>
        <AreaChart
          data={this.state.data}
          width="100%"
          viewBoxObject={{
            x: this.state.xPosition,
            y: this.state.yPosition,
            height: this.state.height,
            width: this.state.width
          }}
          height={450}
          xAxisTickInterval={{ unit: 'year', interval: 1 }}
          yAxisLabel="Time in minutes"
          xAccessor={(d) => {
            return new Date(d[0]);
          }
          }
          yAccessor={(d) => d[1]}
          domain={{ y: [, 60] }}
        />
        {/* TODO: Avoid binding this! */}
        <Websocket url="ws://localhost:1336" onMessage={this.handleData.bind(this)} />
        {/*<button onClick={() => this.setValueForAddTokens(1)}>Debug</button>*/}
      </div>
    );
  }
}

export default WhatIf;
