import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./BoardLink";
import Todo from "./Todo";
import "./Switcher";
import Switcher from "./Switcher";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardslist: ["Pierwsza", "Druga", "Trzecia"],
      text: ""
    };
  }
  render() {
    return (
      <Router>
        <container className="container" role="main">
          <div clsssName="row">
            <header className="col-md-12 text-center text-reset">
              <h1>Trello clone</h1>
            </header>
            <nav className="col-md-3">
              <Todo />
            </nav>
            <section className="col-md-9">
              <Switcher />
            </section>
          </div>
        </container>
      </Router>
    );
  }
}
export function setList(params) {
  return 0;
}

export default App;
