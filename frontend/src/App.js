import React, { Component } from 'react';
import Websocket from 'react-websocket';
import WhatIf from './Components/WhatIf';
import TodoProgress from './Components/TodoProgress';
import { Progress, Button } from 'reactstrap';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);

        this.container = React.createRef();

        this.nodeOne = React.createRef();
        this.nodeTwo = React.createRef();
        this.nodeThree = React.createRef();

        this.dynamicWhatIfNode = React.createRef();
        this.staticWhatIfNode = React.createRef();
        this.progressBar = React.createRef();
    }

    /*handleMessages(message){
        this.dynamicWhatIfNode.current.handleMessages(message);
        this.staticWhatIfNode.current.handleMessages(message);
    }*/

    handleMessages(message){
        var jsonData = JSON.parse(message);
        if (jsonData.type == "Creation") {
            //TODO: Make it so that new TodoProgress elements are created in here
            var transformedWidth = this.container.current.offsetWidth * jsonData.width;
            this.progressBar.current.initialize(transformedWidth, jsonData.position);
        }
    }

    render() {
        return (
            <div ref={this.container}>
                {/* NB! These props ceate an implicit dependency between the view and the interaction tracker and should
              therefore be abolished as quickly as possible! */}
                {/* <div style={{position:"absolute", width:"150px", height:"300px", top:170, left:350 }} ref={this.nodeOne}>
                    <WhatIf identity={1} yLabel="Number of TODOs" domain={[0, 5]} initialValues={[[1, 1], [2, 1]]} yAxisTickCount={5}
                        parentRef={this.nodeOne} ref={this.dynamicWhatIfNode}></WhatIf>
                </div>
                <div style={{position:"absolute", width:"150px", height:"300px", top:70, left:250 }} ref={this.nodeTwo}>
                    <WhatIf identity={2} yLabel="Time in minutes" domain={[0, 120]} initialValues={[[1, 20], [2, 20]]} yAxisTickCount={6}
                        parentRef={this.nodeTwo} ref={this.staticWhatIfNode}></WhatIf>
                </div> */}

                <div style={{position:"absolute", width:"50px", height:"17px", top:25, left:10 }} ref={this.nodeThree}>
                    <TodoProgress identity={3} parentRef={this.nodeThree} ref={this.progressBar}></TodoProgress>
                </div>
                <Websocket url="ws://localhost:1336" onMessage={this.handleMessages.bind(this)} />
            </div>
        );
    }
}

export default App;
