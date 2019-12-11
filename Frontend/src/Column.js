import React, { Component } from "react";
import "./xxxxddd.css";
import Card from "./Card.js";
import { DragSource } from "react-dnd";
import { useDrag } from "react-dnd";
import { Cell as ColTable } from "react-sticky-table";
import { Button } from "react-bootstrap";
import Popup from "reactjs-popup";
import Cookie from "js-cookie";

const API = "http://localhost:3001";
const ADD_COLUMN_QUERY = "/addCard";

export default class Column extends Component{
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      boardName: props.boardName,
      tasks: props.tasks,
      name:props.name      
    };

    this.addCardHandler = this.addCardHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addCardHandler() {
    console.log(
      "dodaje nową kartę do tablicy: " +
      this.state.boardName +
        " do kolumny: " +
     this.state.name +
     " nazawa zadania: "+
     this.state.textFieldValue

    );
   if(this.state.textFieldValue!==""){ 
    fetch(API + ADD_COLUMN_QUERY + "?token=" + Cookie.get("token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.boardName,
        columnName: this.state.name,
        newTask: this.state.textFieldValue
      })
    });
  }}
  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }
  render(){
  
    return (
      <ColTable>
        <div className="lista" >
          <div>
            <h2 class="text-center text-white">{this.state.name}</h2>
          </div>
          {this.state.tasks.map((item, index) => {
            return (
              <div className="karta">
                <div className="p">
                  <div class="text-center text-white">
                    <Popup
                      trigger={
                        <Button variant="success"> {item["nazwaZadania"]}</Button>
                      }
                      position="top center"
                      closeOnDocumentClick
                    >
                      <Card taskName={item["nazwaZadania"]} boardName={this.state.boardName} columnName={this.state.name} taskComment={item.komentarze} />
                    </Popup>
                  </div>
                </div>
              </div>
            );
          })}
          <div>
          <input
                type="text"
                value={this.state.textFieldValue}
                onChange={this.handleChange}
              />
            <Button variant="secondary" size="sm" onClick={this.addCardHandler}>
              New card
            </Button>
          </div>
        </div>
      </ColTable>
    );}
}
// function Column({ boardName, name, tasks }) {
//   const [{ opacity }, dragRef] = useDrag({
//     item: { type: Types.COLUMN },
//     collect: monitor => ({
//       opacity: monitor.isDragging() ? 0.5 : 1
//     })
//   });
  
 
// }
// export default DragSource(Types.COLUMN, cardSource, collect)(Column);
