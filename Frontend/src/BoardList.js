import React, { Component } from "react";
import "./Todo.css";
import { Button } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Cookie from "js-cookie";

const API = "http://localhost:3001";
const DEFAULT_QUERY = "/getAllBoards";
export default class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.chooseBoard = this.chooseBoard.bind(this);
  }
  componentDidMount() {
    console.log("wywyoalja siie TODO");
    fetch(API + DEFAULT_QUERY + "?token=" + Cookie.get("token"))
      .then(response => response.json())
      .then(data => {
        this.setState({ list: data });
        console.log(data);
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");
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

  chooseBoard(index) {
    console.log("chooseBoard");
  }

  render() {
    return (
      <div className="center">
        <h4 className="text-white"> BOARD LIST </h4>
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.text} onChange={e => this.handleChange(e)} />
          <p />
          <button className="btn btn-success"> Add Board </button> <p /> <p />
          {this.state.list.map((item, index) => {
            return (
              <div className="center" class="p">
                <div className="center">
                  <p>
                    {/* <a href={"/" + item}> */}
                    <Link to={"/" + item}>
                      <Button bsStyle="primary"> {item} </Button>
                    </Link>
                    {/* </a> */}
                  </p>
                </div>
              </div>
            );
          })}
        </form>
      </div>
    );
  }
}
