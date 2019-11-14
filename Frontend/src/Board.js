import React, { Component } from "react";
import EdiText from 'react-editext'
import { Button } from "react-bootstrap";
import Column from "./Column";

const API = "http://localhost:3001";
const DEFAULT_QUERY = "/chooseBoard";

const divStyle = {
  display: 'flex',
  alignItems: 'center'
};

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textFieldValue: '',
      columnList: []
    }
    this.props = {
      name: props.name

    };
    this.addColumnHandler = this.addColumnHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(API + DEFAULT_QUERY, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.name
      })
    }).then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data));
        var obj = JSON.stringify(data);
        var parsedJSON = JSON.parse(obj);
        console.log("Nazawa " + parsedJSON['nazwaTablicy']);
        this.setState({ name: parsedJSON['nazwaTablicy'] });
        parsedJSON['kolumny'].map(el => {
          // this.setState({ this.props.columnList.push(id2); });
          this.setState(state => {
            const list = state.columnList.push(el);
            return {
              list
            };
          });
          console.log(el['nazwaKolumny']);
        });
        console.log(this.props.name)
        console.log(this.state.columnList)

        // console.log("data: " + data);
        // console.log("Object.values(data): " + Object.values(data));
        // var list = Object.values(data);
        // list.map(i => console.log("map: " + Object.values(i)))
        //var test =data['kolumny'].json();
        // Object.keys(data).map(id => {
        //   console.log("Data: " + id);
        //   if (id === "nazwaTablicy") {
        //     console.log("First IF: "+id);
        //     this.setState({ name: id });
        //   }
        //   if (id === "kolumny") {
        //     console.log("SECOND IF: "+id);
        //     Object.keys(data['kolumny']).map(id2 => {
        //       console.log("Data in second mappping: " + id2['nazwaKolumny']);
        //       if (id2 === "nazwaKolumny") {
        //         console.log("second maping If: "+id2);
        //         this.props.columnList.push(id2);
        //       }
        //     })
        //   }
        // })
        //this.setState({ columnList:Object.values(data['kolumny']), name: data['nazwaTablicy'] });
        //console.log("TEST: "+data['kolumny']);
        // console.log(this.props.columnList);
      });

  }
  addColumnHandler() {
    console.log("Dodaj kolumne " + this.state.textFieldValue);
    fetch(API + "/addColumn", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.name,
        columnName: this.state.textFieldValue
      })
    })
  }
  onSave = val => {
    console.log('Edited Value -> ', val)
    fetch(API + "/editBoardName", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newBoardName: val,
        oldBoardName: this.props.name
      })
    }).then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data))
        if ("Zmieniono nazwe tablicy" === Object.values(data)) {
          this.setState({ name: val });
        }
        else {
          console.log("nie powiodło się")//przydałoby się jakieś wykakujące okienko
          alert("no nie pykła zmiana nazwy");
        }
      });

  }
  handleChange(event) {
    this.setState({ textFieldValue: event.target.value });
  }
  render() {
    // console.log(this.props.columnList);
    // this.setState({columnList:["adsadsad","asdasdasd","adasdasd","dsadasdas","asdasdas"], name:""});
    return (
      <div style={divStyle}>
        <div className="col-md-1">
          <input type="text" value={this.state.textFieldValue} onChange={this.handleChange} />
        </div>
        <div className="col-md-5">
          <Button variant="info" alignItems="left" onClick={this.addColumnHandler}>Dodaj kolumnę</Button>
        </div>
        <div className="col-md-8">
          <Button bsStyle="primary">
            <EdiText text-center text-white
              type="text"
              value={this.props.name}
              onSave={this.onSave}
              editOnViewClick="true" />
          </Button>
        </div>
        {this.state.columnList.map((item, index) => {
          return <div class="text-center text-white">sdsa</div>;
          // return <Column boardName={this.state.name} columnName={item}/> 
        })}
        {/* {this.state.columnList.map((item, index) => {
                    var linkAdddres = "/";
                    console.log(linkAdddres);
                    return (
                      <div>sdfsdf
                        </div>

                    )
                })} */}

      </div>

    );
  }
}


export default Board;
