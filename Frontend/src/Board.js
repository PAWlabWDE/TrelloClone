import React, { Component } from "react";
import EdiText from 'react-editext'

const API = "http://localhost:3001";
const DEFAULT_QUERY = "/chooseBoard";

class Board extends Component {
  constructor(props) {
    super(props);
    this.props = {
      name: props.name,
      columnList: []
    };
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
        console.log("Nazawa "+obj['nazwaTablicy']);
        console.log(JSON.stringify(obj['kolumny']));
        var obj2=JSON.stringify(obj['kolumny']);


        console.log("data: "+data);
        console.log("Object.values(data): "+Object.values(data));
        var list  = Object.values(data);
        list.map(i=>console.log("map: "+Object.values(i)))
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
    }).then(response=>response.json())
    .then(data=>{
      console.log(Object.values(data))
        if("Zmieniono nazwe tablicy"===Object.values(data))
        {
          this.setState({ name: val });
        }
    });

  }

  render() {
    // console.log(this.props.columnList);
    return (
      <div>
        <h2 text-center text-white>{this.props.name}  {this.props.columnList}</h2>
        <EdiText text-center text-white
          type="text"
          value={this.props.name}
          onSave={this.onSave}
          editOnViewClick	="true"
          
        />
      </div>
    );
  }
}


export default Board;
