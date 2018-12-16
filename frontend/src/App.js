import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WhatIf from './Components/WhatIf';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);

        this.nodeOne = React.createRef();
        this.nodeTwo = React.createRef();
    }

    render() {
        return (
            <div>
                {/* NB! These props create an implicit dependency between the view and the interaction tracker and should
              therefore be abolished as quickly as possible! */}
                <div style={{position:"absolute", width:"150px", height:"300px", top:170, left:350 }} ref={this.nodeOne}>
                    <WhatIf identity={1} parentRef={this.nodeOne}></WhatIf>
                </div>
                <div style={{position:"absolute", width:"150px", height:"300px", top:70, left:250 }} ref={this.nodeTwo}>
                    <WhatIf identity={2} parentRef={this.nodeTwo}></WhatIf>
                </div>
            </div>
        );
    }
}

export default App;
