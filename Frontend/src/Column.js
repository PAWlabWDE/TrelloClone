import React, { Component } from "react";
import Card from "./Card"

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardName: props.boardName
    };
    this.props = {
      columnName: props.name,
      tasks: props.tasks
    };
  }
 

  render() {
    return (
      <div>
        <h2 class="text-center text-white">{this.props.columnName}</h2>
        {this.props.tasks.map((item, index) => {
          return (
            <div className="center">
              <div className="p">
                <div class="text-center text-white">
<Card text={item["nazwaZadania"]}/>                
                  {/* {item["nazwaZadania"]} + {index} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
