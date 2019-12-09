import React, { Component } from "react";
import EdiText from "react-editext";
import { Button } from "react-bootstrap";
import ColumnV2 from "./ColumnV2";
import Column from "./Column";
import Cookie from "js-cookie";

const API = "http://localhost:3001";
const DEFAULT_QUERY = "/chooseBoard";

const divStyle = {
  display: "flex",
  alignItems: "center"
};

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

    if (this.props.name !== "") {
      return (
        <div style={divStyle}>
          <div className="col-md-1">
            <input
              type="text"
              value={this.state.textFieldValue}
              onChange={this.handleChange}
            />
          </div>
          <div className="col-md-5">
            <Button
              variant="info"
              alignItems="left"
              onClick={this.addColumnHandler}
            >
              Dodaj kolumnę
            </Button>
          </div>
          <div className="col-md-8">
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
          </div>
          {this.state.columnList.map((item, index) => {
            console.log("tescik: "+item["nazwaKolumny"])
         ;
            return (
             // <ColumnV2 name={item["nazwaKolumny"]} tasks={item["listZadan"]} />
              <Column boardName={this.props.name} name={item["nazwaKolumny"]} tasks={item["listZadan"]}/>
            );
          })}

        </div>
      );
    } else {
      return <div style={divStyle}></div>;
    }
  }
}

export default Board;
