import React, { Component, Text } from "react";
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";
import Cookie from "js-cookie";
import InputFileButton from "./InputFileButton";
//import { Text, StyleSheet } from 'react-native';

const API = "http://localhost:3001";
const ADD_COMMENT_QUERY = "/addComment";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      boardName: props.boardName,
      taskName: props.taskName,
      columnName: props.columnName,
      comments: props.taskComment
    };

    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addCommentHandler() {
    console.log(
      "board: " +
        this.state.boardName +
        " column: " +
        this.state.columnName +
        " task: " +
        this.state.taskName +
        " \ncomment: " +
        this.state.textFieldValue
    );
    if (this.state.textFieldValue !== "") {
      fetch(API + ADD_COMMENT_QUERY + "?token=" + Cookie.get("token"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          boardName: this.props.boardName,
          columnName: this.state.columnName,
          taskName: this.state.taskName,
          comment: this.state.textFieldValue
        })
      });
    }
  }
  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }
  render() {
    return (
      <div>
        <Popup
          modal
          trigger={<Button variant="outline-primary">Details</Button>}
        >
          <header className="col-md-12 text-center">
            <h1 style={{ color: "red" }}> {this.state.taskName} //Details </h1>
          </header>
          <h2 style={{ color: "blue" }}> Komentarze: </h2>
          {this.state.comments.map((item, index) => {
            return <div className="center" class="p" key={index}>
                <h2 style={{ color: "green" }}> {item.kto} :  {item.co} </h2>
            </div>;
          })}
          <input
            type="text"
            value={this.state.textFieldValue}
            onChange={this.handleChange}
          />

          <Button onClick={this.addCommentHandler}>Add Comment</Button>
          <InputFileButton buttonClass="outline-info" />
        </Popup>
        }
      </div>
    );
  }
}
