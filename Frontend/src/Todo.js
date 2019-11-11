import React, { Component } from 'react';
import BoardLink from "./BoardLink";
import "./Todo.css";

/*
Jak chcesz zoabczyć czy działą to urhcom w nastepujacy sposób
win+r
chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
i tam localhost:3000
*/


const API = 'http://localhost:3001';
const DEFAULT_QUERY = '/getAllBoards';
export default class Todo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      text: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.chooseBoard = this.chooseBoard.bind(this);
  }
  componentDidMount() {
    console.log("wywyoalja siie TODO");
    fetch(API + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => { this.setState({ list: data }); console.log(data); });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");
    if (this.state.text !== "") {
      this.setState(prevState => ({
        list: prevState.list.concat(this.state.text),
        text: ''
      }))
      //tutaj wyślij do serwera nową tablicę
      fetch(API + "/addBoard", {
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


  }

  handleChange(e) {
    //console.log("handleChange");
    this.setState({
      text: e.target.value
    })
  }

  chooseBoard(index) {
    console.log("chooseBoard");


  }

  render() {

    return (
      <div class="center">
        <h4>BOARD LIST</h4>
        <form onSubmit={this.handleSubmit}>
          <input value={this.state.text} onChange={e => this.handleChange(e)} />
          <p />
          <button class="btn btn-success">Add Board</button>
          <p /><p />
          <ol>
            {this.state.list.map((item, index) => {
              return (
                <ul >
                  <p />
                  <div class="center">
                    <BoardLink name={item}></BoardLink>
                  </div>
                </ul>)
            })}
          </ol>
        </form>
      </div>
    )
  }
}