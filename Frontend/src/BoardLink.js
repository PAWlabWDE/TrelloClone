import React, { Component } from "react";
import { BrowserRouter as Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import "./Todo.css";
import "./App.css";
import {setList} from "./App";
const API = 'http://localhost:3001';


class BoardLink extends Component {
  constructor(props) {
    super(props);

    this.props = {
      name: ""
    };
    // Poniższe wiązanie jest niezbędne do prawidłowego przekazania `this` przy wywołaniu funkcji
    this.handleClick = this.handleClick.bind(this);

  }
  handleSubmit(e) {
    e.preventDefault();

    fetch(API + "/chooseBoard", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boardName: this.state.text
      })
    })



  }
  handleClick() {
    console.log("KLIKNIĘTO: "+this.props.name);
    setList(this.props.name);
  }
  render() {
    var linkAdddres = "/".concat(this.props.name);
    console.log("Board Link: " + linkAdddres);

    return (
      <form onSubmit={this.handleSubmit}>
        <div class="center">
          <Link to={linkAdddres}><Button bsStyle="primary" onClick={this.handleClick}>{this.props.name}</Button></Link>
        </div>
        <section class="section">{this.props.name}</section>
      </form>

    );
  }
}

export default BoardLink;
