import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import BoardList from "./BoardList";
import Loginn from "./LogIn";
import Register from "./Register";
import Switcher from "./Switcher";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/">
          <Loginn />
        </Route>
        <Route exact path="/reg">
          <Register />
        </Route>
        <Route exact path="/home">
          <container className="container" role="main">
            <div className="row">
              <header className="col-md-12 text-center text-white">
                <h1> Trello clone </h1>
              </header>
              <div className="col-md-11"></div>
              <div className="col-md-1">
                <Link to="/">
                  <Button type="button" variant="primary">
                    Log in
                  </Button>
                </Link>
              </div>
              <nav className="col-md-3">
                <BoardList />
              </nav>
              <section className="col-md-9">
                {console.log("przed switcherem")}
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
