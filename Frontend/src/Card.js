import React, { Component, Text } from "react";
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";
import Cookie from "js-cookie";
import InputFileButton from "./InputFileButton";
import { Container, Row, Col } from "react-bootstrap";
//import { Text, StyleSheet } from 'react-native';
import { BrowserRouter as  Link } from "react-router-dom";

const API = "http://localhost:3001";
const ADD_COMMENT_QUERY = "/addComment";

const boardName = Cookie.get("boardName") ? Cookie.get("boardName") : null;
const columnName = Cookie.get("columnName") ? Cookie.get("columnName") : null;
const taskName = Cookie.get("taskName") ? Cookie.get("taskName") : null;

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      boardName: props.boardName,
      taskName: props.taskName,
      columnName: props.columnName,
      comments: props.taskComment,
      attachments:props.attachments      
    };

    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openAttachemnt=this.openAttachemnt.bind(this);
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
  openAttachemnt(e){
    //console.log("OPEN: "+e.target.value);
    alert(e.target.value)
   // window.open(e.target.value)
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
          <Container>
            <Row>
            <Col md={{ span:3 }}>
             
                <h4 style={{ color: "orange" }}> Attachments: </h4>
                {this.state.attachments.map((item, index) => {
                return (
                  <div className="center" class="p" key={index}>
                                <h4 style={{ color: "green" }}>
                      <div>
                      {item.kto}: </div> </h4>
                <Button value={item.co} onClick={this.openAttachemnt}>Attachment {index+1}</Button>
                   
                    
                  </div>
                );
              })}
              
            </Col>
            <Col md={{ span:9 }}>
              <header className="col-md-12 text-center">
                <h1 style={{ color: "red" }}>
                  {" "}
                  {this.state.taskName} //Details{" "}
                </h1>
              </header>
              <h2 style={{ color: "blue" }}> Komentarze: </h2>
              {this.state.comments.map((item, index) => {
                return (
                  <div className="center" class="p" key={index}>
  
                    <h4 style={{ color: "green" }}>
                      {" "}
                      {item.kto} : {item.co}{" "}
                    </h4>
                  </div>
                );
              })}
              <input
                type="text"
                value={this.state.textFieldValue}
                onChange={this.handleChange}
              />

              <Button onClick={this.addCommentHandler}>Add Comment</Button>
              <InputFileButton buttonClass="outline-info" boardName={this.state.boardName} columnName={this.state.columnName} taskName={this.state.taskName} />
            </Col>
            </Row>
          </Container>
        </Popup>
        }
      </div>
    );
  }
}
