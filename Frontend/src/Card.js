import React, { Component, Text } from "react";
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";
import Cookie from "js-cookie";
import InputFileButton from "./InputFileButton";
import { Container, Row, Col } from "react-bootstrap";
//import { Text, StyleSheet } from 'react-native';
import { BrowserRouter as Link } from "react-router-dom";
import { CirclePicker } from 'react-color';

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
      attachments: props.attachments,
      label: props.labels,
      history: props.history,
      taskID: props.taskID,
      labelName: ' ',
      labelColor: ' '

    };

    this.addCommentHandler = this.addCommentHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openAttachemnt = this.openAttachemnt.bind(this);
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.deleteLabel=this.deleteLabel.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleChangeLabelName = this.handleChangeLabelName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addCommentHandler() {

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
      }).then(response => response.json())
      .then(data => {
        var obj = JSON.stringify(data);
        var parsedJSON = JSON.parse(obj);
       // this.setState({tasks :[]})
       this.setState(state => {
        const list = state.comments.push(parsedJSON);
        return {
          list
        };
      });   
      });
    }
  }

  openAttachemnt(e) {
    alert(e.target.value);
  }

  deleteAttachment(e) {
    fetch(API + "/attachment" + "?token=" + Cookie.get("token"), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.boardName,
        columnName: this.state.columnName,
        taskName: this.state.taskName,
        attachmentNumber: e.target.value
      })
    });

  }

  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }
  handleChangeColor(color, event) {
    console.log("color: " + color.hex)
    this.setState({ labelColor: color.hex })
  }
  handleChangeLabelName(event) {
    this.setState({labelName: event.target.value});
  }
//dodawnie label
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.labelName + ' Color:'+this.state.labelColor);
    if(this.state.labelName!=='' && this.state.labelColor!==''){
      fetch(API+"/label" + "?token=" + Cookie.get("token"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          boardName: this.state.boardName,
          columnName: this.state.columnName,
          taskID: this.state.taskID,
          labelColor: this.state.labelColor,
          labelName:this.state.labelName
        })
      }).then(response => response.json())
      .then(data => {
        var obj = JSON.stringify(data);
        var parsedJSON = JSON.parse(obj);
       // this.setState({tasks :[]})
       this.setState(state => {
        const list = state.label.push(parsedJSON);
        return {
          list
        };
      });   
      });
      // if(this.state.labelName===''){
      //   //add only label with color
      // }
      // else if(this.state.labelColor===''){
      //   //add only label with text
      // }
      // else{
  
      // }
    }

    
    this.setState({labelColor:' ',labelName:' '})
    event.preventDefault();
  }
  deleteLabel(e){
    fetch(API+"/label" + "?token=" + Cookie.get("token"), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.state.boardName,
        columnName: this.state.columnName,
        taskID: this.state.taskID,
        labelID:e.target.value
      })
    });
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
              <Col md={{ span: 3 }}>
                <Popup
                  modal
                  trigger={<Button variant="outline-primary">Labels</Button>}
                >
                  <Row>
                    <Col>
                    <div>
                  <label style={{background: 'white', color: 'black',alignSelf: 'flex-start'}}>Label's color:</label>
                  </div>
                  <div>
                  <CirclePicker onChange={this.handleChangeColor} />
                  </div>
                  <form onSubmit={this.handleSubmit}>
        <label>
        <label style={{background: 'white', color: 'black',alignSelf: 'flex-start'}}>Label's name:</label>
          <input type="text" value={this.state.value} onChange={this.handleChangeLabelName} />
        </label>
        <input type="submit" value="Add label" />
      </form>
                  </Col>
                  <Col md={{ span: 3 }}>
                  <h3 style={{background: 'white', color: 'grey',alignSelf: 'flex-start'}}>Current labels:</h3>
                  {
                    this.state.label.map((item,index)=>{
                      return(
                        <Row  >
                         <div className="center" class="p" key={index}>
                      <h4 style={{ color: "green" }}>
                        <div style={{backgroundColor: item.labelColor}}>
                        {item.labelName}   <Button
                        value={item.nrLabel}
                        onClick={this.deleteLabel}
                        variant="outline-secondary"
                      >
                        Delete 
                      </Button>
                      </div>
                      </h4>
                  

                    
                    </div>
                    </Row>
                     );
                    })
                  }
                  </Col>
                  </Row>
                </Popup>
                <h3 style={{background: 'white', color: 'grey',alignSelf: 'flex-start'}}>Current labels:</h3>
                  {
                    this.state.label.map((item,index)=>{
                      return(
                        <Row  >
                         {/* <div className="center" class="p" key={index}>
                      <h4 style={{ color: "green" }}>
                        {item.labelName}: {item.labelColor}   
                      </h4>
                  

                    
                    </div> */}
                    <a style={{backgroundColor: item.labelColor, color: "black","width" : "100px" }}>{item.labelName}`{' '} </a>
                    </Row>
                     );
                    })
                  }
                <h4 style={{ color: "orange" }}> Attachments: </h4>
                {this.state.attachments.map((item, index) => {
                  return (
                    <div className="center" class="p" key={index}>
                      <h4 style={{ color: "green" }}>
                        <div>{item.kto}: </div>
                      </h4>
                      <Button value={item.co} onClick={this.openAttachemnt}>
                        Attachment {index + 1}
                      </Button>
                      <Button
                        value={item.nrZalocznika}
                        onClick={this.deleteAttachment}
                        className="m-2"
                      >
                        Delete {index + 1}
                      </Button>
                    </div>
                  );
                })}
              </Col>
              <Col md={{ span: 9 }}>
                <header className="col-md-12 text-center">
                  <h1 style={{ color: "red" }}>
                    {this.state.taskName} //Details
                  </h1>
                </header>
                <h2 style={{ color: "blue" }}> Historia: </h2>
                {this.state.history.map((item, index) => {
                  return (
                    <div className="center" class="p" key={index}>
                      <h4 style={{ color: "green" }}>
                        {item.data}
                        {item.what}
                      </h4>
                    </div>
                  );
                })}
                <h2 style={{ color: "blue" }}> Komentarze: </h2>
                {this.state.comments.map((item, index) => {
                  return (
                    <div className="center" class="p" key={index}>
                      <h4 style={{ color: "green" }}>
                        {item.kto} : {item.co}
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
                <InputFileButton
                  buttonClass="outline-info"
                  boardName={this.state.boardName}
                  columnName={this.state.columnName}
                  taskName={this.state.taskName}
                />
              </Col>
            </Row>
          </Container>
        </Popup>
        }
      </div>
    );
  }
}
