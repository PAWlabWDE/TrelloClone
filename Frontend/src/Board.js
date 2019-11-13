import React, { Component } from "react";

class Board extends Component {
  constructor(props) {
    super(props);

    this.props = {
      name: props.name
    };
  }
  render() {

    console.log("Board : " + this.props.name);

    return (
      <h1 className="text-center text-white">{this.props.name}</h1>
    );
  }
}


export default Board;
