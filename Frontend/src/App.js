import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Switcher from "./Switcher";
import BoardList from "./BoardList";

class App extends Component {
  render() {
    return (
      <Router>
       <container className="container" role="main">
          <div className="row">
            <header className="col-md-12 text-center text-white">
              <h1> Trello clone </h1>
            </header>
            <nav className="col-md-3">
              <BoardList />
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

export default App;
