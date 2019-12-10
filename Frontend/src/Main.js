import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Board from "./Board";
import Cookie from "js-cookie";
import { Button } from "react-bootstrap";
import { BrowserRouter as Switch, Route, Link } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";
const API = "http://localhost:3001";
const DEFAULT_QUERY = "/getAllBoards";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: "",
      choosenBoard: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
   // this.selectBoard = this.selectBoard.bind(this);
  }
  componentDidMount() {
    fetch(API + DEFAULT_QUERY + "?token=" + Cookie.get("token"))
      .then(response => response.json())
      .then(data => {
        this.setState({ list: data });
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text !== "") {
      this.setState(prevState => ({
        list: prevState.list.concat(this.state.text),
        text: ""
      }));
      //tutaj wyślij do serwera nową tablicę

      fetch(API + "/addBoard" + "?token=" + Cookie.get("token"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          boardName: this.state.text
        })
      });
    }
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  // selectBoard(name){
  //   this.setState({
  //     choosenBoard=name.target.value
  //   });
  //   console.log(this.state.choosenBoard);
  //   this.render();
  // }
  render() {
    console.log(this.state.list);
    return (
      
        <Container className="container" role="main">
          <Row>
            <header className="col-md-12 text-center text-white">
              <h1> Trello clone </h1>
            </header>
          </Row>
          <Row>
            <Col md={{ span: 3 }}>
              <div className="center">
                <h4 className="text-white"> BOARD LIST </h4>
                <form onSubmit={this.handleSubmit}>
                  <input
                    value={this.state.text}
                    onChange={e => this.handleChange(e)}
                  />
                  <p />
                  <button className="btn btn-success">
                    {" "}
                    Add Board{" "}
                  </button> <p /> <p />
                  {this.state.list.map((item, index) => {
                    return (
                      <div className="center" class="p" key={index}>
                        <div className="center">
                          <p>
                            {/* <Link to={"/" + item}> */}
                              <Button bsStyle="primary" value={item} 
                             onClick={(e) => {this.setState({ choosenBoard:e.target.value}); this.render()}}>
                                {item}
                              </Button>
                            {/* </Link> */}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </form>
              </div>
            </Col>
            <Col>
            <Board name={this.state.choosenBoard} />
              {/* <Switch>
                {this.state.list.map((item, index) => {
                  var linkAdddres = "/".concat(item);

                  return (
                    <Route path={linkAdddres} key={index}>
                      <Board name={item} />
                    </Route>
                  );
                })}
              </Switch> */}
            </Col>
          </Row>
        </Container>
      
    );
  }
}

export default Main;
