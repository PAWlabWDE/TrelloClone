import React, { Component } from "react";
import Board from "./Board";
import Cookie from "js-cookie";
import { Button } from "react-bootstrap";
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
    this.props={
      choosenBoard: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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


  render() {
    console.log(this.state.list);
    return (
      
        <Container >
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
                          
                              <Button bsStyle="primary" value={item} 
                             onClick={(e) => this.setState({ choosenBoard:e.target.value})}>
                                {item}
                              </Button>
                 
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </form>
              </div>
            </Col>
            <Col md={{ span:9 }}>
            {console.log("przed XD x: "+this.state.choosenBoard)}
            <Board name={this.state.choosenBoard}/>
            </Col>
          </Row>
        </Container>
      
    );
  }
}

export default Main;
