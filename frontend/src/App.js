import React, { Component } from 'react';
import WhatIf from './Components/WhatIf';
import './App.css';

class App extends Component {

  render() {
    return (
      <div>
          {/* NB! These props create an implicit dependency between the view and the interaction tracker and should
              therefore be abolished as quickly as possible! */}
          <WhatIf identity={2}></WhatIf>
      </div>
    );
  }
}

export default App;
