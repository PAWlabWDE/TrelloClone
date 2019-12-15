import React, { Component } from "react";
import "./xxxxddd.css";
import Card from "./Card.js";
import { Cell as ColTable } from "react-sticky-table";
import { Button } from "react-bootstrap";
import Popup from "reactjs-popup";
import Cookie from "js-cookie";
import TextEllipsis from 'react-text-ellipsis';
import { Container, Row, Col } from "react-bootstrap";

const API = "http://localhost:3001";
const ADD_COLUMN_QUERY = "/addCard";


export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      boardName: props.boardName,
      tasks: props.tasks,
      name: props.name
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
      " nazawa zadania: " +
      this.state.textFieldValue

    );
    if (this.state.textFieldValue !== "") {
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
      }).then(response => response.json())
      .then(data => {
        var obj = JSON.stringify(data);
        var parsedJSON = JSON.parse(obj);
       // this.setState({tasks :[]})
       this.setState(state => {
        const list = state.tasks.push(parsedJSON);
        return {
          list
        };
      });
     
        
        
      });
    }
  }
  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }

  render() {

    return (
      <ColTable>
        <div className="lista" >
          <div>
            <h2 class="text-center text-white">{this.state.name}</h2>
          </div>
          {this.state.tasks.map((item, index) => {
            return (

              <Popup
                trigger={
                  <div className="karta" onClick={e => console.log("FUCK YOU")}>

                    <Row>
                      {item["label"].map((item, index) => {
                        return (
                          <Row  >
                             <a style={{ backgroundColor: "#808080", "width": "35px", "height": "20px"}}> </a>
                            <a style={{ backgroundColor: item.labelColor, "width": "50px", "height": "20px"}}> </a>
                           
                          </Row>
                        );
                      })
                      }
                    </Row>
                 


                      <div className="display-linebreak" class=" text-white">
                        {item["nazwaZadania"].split("\n").map((i, key) => {
                        //  console.log("Line "+i);
                          return <div key={key}>{i}</div>;
                        })}
                      </div>



                   

                  </div>
                }
                position="top center"
                closeOnDocumentClick
              >
                <Card taskName={item["nazwaZadania"]} boardName={this.state.boardName} columnName={this.state.name} taskComment={item.komentarze} attachments={item.zalaczniki} labels={item.label} history={item.history} taskID={item.nrZadania} />
              </Popup>

            );
          })}
          <div>
            <textarea
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
    );
  }
}

