import React, { Component } from "react";
import EdiText from "react-editext";
import { Button } from "react-bootstrap";
import Column from "./ColumnV2";
//mport Column from "./Column";
import Cookie from "js-cookie";
// import { useDrag } from 'react-dnd'
// import { ItemTypes } from './Constants'
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { Container, Row, Col } from "react-bootstrap";
import "./xxxxddd.css";
const API = "http://localhost:3001";
const DEFAULT_QUERY = "/chooseBoard";



class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: "",
      columnList: []
    };
    this.props = {
      name: props.name
    };
    this.addColumnHandler = this.addColumnHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.name !== "") {
      fetch(API + DEFAULT_QUERY + "?token=" + Cookie.get("token"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          boardName: this.props.name
        })
      })
        .then(response => response.json())
        .then(data => {
          var obj = JSON.stringify(data);
          var parsedJSON = JSON.parse(obj);

          this.setState({ name: parsedJSON["nazwaTablicy"] });
          parsedJSON["kolumny"].map(el => {
            this.setState(state => {
              const list = state.columnList.push(el);
              return {
                list
              };
            });
          });
        });
    }
  }
  addColumnHandler() {
    //console.log("Dodaj kolumne " + this.state.textFieldValue);
    fetch(API + "/addColumn" + "?token=" + Cookie.get("token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.name,
        columnName: this.state.textFieldValue
      })
    });
  }
  onSave = val => {
    console.log("Edited Value -> ", val);
    fetch(API + "/editBoardName" + "?token=" + Cookie.get("token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newBoardName: val,
        oldBoardName: this.props.name
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        if ("Zmieniono nazwe tablicy" === Object.values(data)) {
          this.setState({ name: val });
        } else {
          alert("no nie pykła zmiana nazwy");
        }
      });
  };
  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }
  render() {
    return (
      <DndProvider backend={Backend}>
        <Container>
          <Row>
            <Col>
              <input
                type="text"
                value={this.state.textFieldValue}
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <Button
                variant="info"
                alignItems="left"
                onClick={this.addColumnHandler}
              >
                Dodaj kolumnę
              </Button>
            </Col>
            <Button bsStyle="primary">
              <EdiText
                text-center
                text-white
                type="text"
                value={this.props.name}
                onSave={this.onSave}
                editOnViewClick="true"
              />
            </Button>
            <Col>
            </Col>
          </Row>
          <section class="card">
          <Row>
          
           {this.state.columnList.map((item, index) => {
            return (
              <Column name={item["nazwaKolumny"]} tasks={item["listZadan"]} />
              //<Column boardName={this.props.name} name={item["nazwaKolumny"]} tasks={item["listZadan"]}/>
            );
          })}
           
          </Row>
          </section>
        </Container>
      
      </DndProvider>
    );
  }
}

export default Board;
