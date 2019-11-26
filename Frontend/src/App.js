import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./BoardLink";
import Todo from "./Todo";
import "./Switcher";
import Loginn from "./logowanie";
import Switcher from "./Switcher";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/log">
          <Loginn />
        </Route>
        <Route exact path="/">
          <container className="container" role="main">
            <div className="row">
              <header className="col-md-12 text-center text-white">
                <h1> Trello clone </h1>
              </header>
              <nav className="col-md-3">
                <Todo />
              </nav>
              <section className="col-md-9">
                <Switcher />
              </section>
            </div>
          </container>
        </Route>
      </Router>
    );
  }
}

export default App;
