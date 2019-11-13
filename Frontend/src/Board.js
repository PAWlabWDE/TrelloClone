import React, { Component } from "react";

const API = "http://localhost:3001";
const DEFAULT_QUERY = "/chooseBoard";

class Board extends Component {
  constructor(props) {
    super(props);
    this.props = {
      name: props.name
    };
  }

  componentDidMount() {
    fetch(API + DEFAULT_QUERY, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.name
      })
    }).then(response => response.json())
      .then(data => {

        console.log(data);
      });

  }


  render() {

    console.log("Board : " + this.props.name);

    return (
      <h1 className="text-center text-white">{this.props.name}</h1>
    );
  }
}


export default Board;
