import React, { Component } from 'react';
import Websocket from 'react-websocket';
import WhatIf from './Components/WhatIf';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);

        this.nodeOne = React.createRef();
        this.nodeTwo = React.createRef();

        this.dynamicWhatIfNode = React.createRef();
        this.staticWhatIfNode = React.createRef();
    }

    handleMessages(message){
        this.dynamicWhatIfNode.current.handleMessages(message);
        this.staticWhatIfNode.current.handleMessages(message);
    }

    render() {
        return (
            <div>
                {/* NB! These props create an implicit dependency between the view and the interaction tracker and should
              therefore be abolished as quickly as possible! */}
                <div style={{position:"absolute", width:"150px", height:"300px", top:170, left:350 }} ref={this.nodeOne}>
                    <WhatIf identity={1} yLabel="Number of TODOs" domain={[0, 5]} initialValues={[[1, 1], [2, 1]]} yAxisTickCount={5}
                        parentRef={this.nodeOne} ref={this.dynamicWhatIfNode}></WhatIf>
                </div>
                <div style={{position:"absolute", width:"150px", height:"300px", top:70, left:250 }} ref={this.nodeTwo}>
                    <WhatIf identity={2} yLabel="Time in minutes" domain={[0, 120]} initialValues={[[1, 20], [2, 20]]} yAxisTickCount={6}
                        parentRef={this.nodeTwo} ref={this.staticWhatIfNode}></WhatIf>
                </div>
                <Websocket url="ws://localhost:1336" onMessage={this.handleMessages.bind(this)} />
            </div>
        );
    }
}

export default App;
