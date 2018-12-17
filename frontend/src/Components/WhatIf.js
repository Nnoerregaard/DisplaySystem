import React, { Component } from 'react';
import rd3 from 'rd3';
import d3 from 'd3';
import _ from 'underscore';

class WhatIf extends Component {
  constructor(props){
    super(props);
    this.state = {
      tokenValue: 1,
      width: 150,
      height: 300,
      xPosition: 0,
      yPosition: 87,
      // First one is x value, the next is y value in the arrays within the array
      data: [
        {
          "values": this.props.initialValues
        }/*,
        {
          "name": "",
          "values": [[1, 1], [2, 1]]
        },
        {
          "name": "",
          "values": [[1, 1], [2, 1]]
        }*/
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

        // Hack to make the static visualization stay put
        if (this.props.identity !== 2){
          this.setPosition(jsonData.position);
        }

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
      var value = state.tokenValue * numberOfAddTokens;

      var newEntry = {"values": [[1, value], [2, value]]}
      newData.push(newEntry);

      return {data: newData}
    });
  }

  setPosition(position){
    var positionInLocalCoordinates = this.convertToLocalCoordinateSystem(position);

    this.props.parentRef.current.style.top = positionInLocalCoordinates.y + "px";
    this.props.parentRef.current.style.left = positionInLocalCoordinates.x + "px";
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
  //033D17 = green, #920903 = red, #DB9700 = yellow, #0000FF = blue
  var colors = ["#033D17", "#920903"]
  {/*colors={d3.scale.ordinal().range(colors)}*/ }
  //, "#DB9700", "#0000FF"]
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
          height={470}
          xAxisTickInterval={{ unit: 'year', interval: 1 }}
          yAxisLabel={this.props.yLabel}
          yAxisTickCount={this.props.yAxisTickCount}
          yAxisLabelOffset={30}
          xAccessor={(d) => {
            return new Date(d[0]);
          }
          }
          yAccessor={(d) => d[1]}
          domain={{ y: this.props.domain }}
        />
      </div>
    );
  }
}

export default WhatIf;
