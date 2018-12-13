import React, { Component } from 'react';
import Websocket from 'react-websocket';
import './App.css';
import rd3 from 'rd3';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tokenValue: 5,
      width: 960,
      height: 600,
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
      ]
    };
  }

  handleData(data){
    debugger;
    this.increaseValue();
  }

  // TODO: This can be done way more elegant!
  increaseValue(){
    this.setState((state, props) => {
      var newData = state.data;
      var newFirstValue = state.data[1]["values"][0][1] + state.tokenValue;
      var newSecondValue = state.data[1]["values"][1][1] + state.tokenValue;

      newData[1]["values"][0][1] = newFirstValue;
      newData[1]["values"][1][1] = newSecondValue;

      return {data: newData}
    });
  }

  // TODO: Avoid binding this!
  render() {
  var AreaChart = rd3.AreaChart;
    return (
      <div>
        <AreaChart
          data={this.state.data}
          width="100%"
          viewBoxObject={{
            x: 0,
            y: 0,
            height: 400,
            width: 500
          }}
          height={400}
          title="Area Chart"
          xAxisTickInterval={{ unit: 'year', interval: 1 }}
          xAxisLabel="Year"
          yAxisLabel="Share Price"
          xAccessor={(d) => {
            return new Date(d[0]);
          }
          }
          yAccessor={(d) => d[1]}
          domain={{ y: [, 60] }}
        />
        <Websocket url="ws://localhost:1336" onMessage={this.handleData.bind(this)} />
      </div>
    );
  }
}

export default App;
