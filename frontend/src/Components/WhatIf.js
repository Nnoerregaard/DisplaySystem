import React, { Component } from 'react';
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
      networkData: {}
    };
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

  // TODO: This can be done way more elegantly!
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

    this.props.parentRef.current.style.top = positionInLocalCoordinates.y + "px";
    this.props.parentRef.current.style.left = positionInLocalCoordinates.x + "px";
    /*this.setState({xPosition: positionInLocalCoordinates.x, 
                   yPosition: positionInLocalCoordinates.y})*/

  }

  convertToLocalCoordinateSystem(position){
    /* NB! Be aware that these change if you change 
    * the size of the visualization or want to change
    * where it appears relative to the referent */
    var xWorldToLocalConversionFactor = -350;
    var yWorldToLocalConversionFactor = -486;

    return {x : (position.x * xWorldToLocalConversionFactor) + 420,
            y : (position.y * yWorldToLocalConversionFactor) + 219 };
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
      </div>
    );
  }
}

export default WhatIf;
