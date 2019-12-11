import React, { Component } from "react";
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";
import Cookie from "js-cookie";
import InputFileButton from "./InputFileButton";

const API = "http://localhost:3001";
const ADD_COMMENT_QUERY = "/addComment";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      boardName: props.boardName,
      taskName: props.taskName,
      columnName: props.columnName
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
        {this.state.taskName}
        <Popup
          modal
          trigger={<Button variant="outline-primary">Details</Button>}
        >
          <input
            type="text"
            value={this.state.textFieldValue}
            onChange={this.handleChange}
          />
          <p />
          <Button onClick={this.addCommentHandler}>Add Comment</Button>
          <InputFileButton buttonClass="outline-info" />
        </Popup>
        }
      </div>
    );
  }
}
