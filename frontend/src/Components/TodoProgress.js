
import React, { Component } from 'react';
import { Progress } from 'reactstrap';
import Get from 'restful-react';
import _ from 'underscore';

class TodoProgress extends Component {
  constructor(props){
    super(props);
    this.state = { value: 0};
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

  initialize(transformedWidth, position){
    this.setPosition(position);
    this.props.parentRef.current.style.width = transformedWidth + "px";
    this.props.parentRef.current.style.display = "block";
  }

  handleData(jsonData){
    //Only update if there is something new
    if (!_.isEqual(this.state.networkData, jsonData)){
    }
  }

  updateIdentity(jsonIdentityUpdate){
    this.setState({identity: jsonIdentityUpdate.identity});
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
    var xWorldToLocalConversionFactor = 8.3;
    var yWorldToLocalConversionFactor = -544.2857;

    return {x : (position.x * xWorldToLocalConversionFactor),
            y : (position.y * yWorldToLocalConversionFactor) + 460.4286 };
  }

  render() {
    return (
      <div>
        <Get path="http://localhost:3000/atomicTokenAddition" lazy>
        {(data, states, { get }) => (
            <Progress value={this.state.value} />
        )}
        </Get>
      </div>
    );
  }
}

export default TodoProgress;
