import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Switcher from "./Switcher";
import BoardList from "./BoardList";
import Board from "./Board";
import { Container, Row, Col } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.handleChange2 = this.handleChange2.bind(this);
  }
  handleChange2 = name => {
    this.setState({ name: name });
  };

  render() {
    return (
      <Router>
        <container className="container" role="main">
          <Row>
            <header className="col-md-12 text-center text-white">
              <h1> Trello clone </h1>
            </header>
          </Row>
          <Row>
            <Col>
              <BoardList />
            </Col>
            <Col>
              <Board name="pierwsza" />
            </Col>
          </Row>
        </container>
      </Router>
    );
  }
}
function cos() {}
export default App;
