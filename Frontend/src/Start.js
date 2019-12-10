import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Loginn from "./LogIn";
import Register from "./Register";
import Main from "./Main"

class Start extends Component {
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
            <Main/>
        </Route>
      </Router>
    );
  }
}

export default Start;
