import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const API = "http://localhost:3001";
const REGISTER_QUERY="/register";
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.emailWritten = this.emailWritten.bind(this);
    this.passwordWritten = this.passwordWritten.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
  }
  emailWritten(e) {
    this.setState({ email: e.target.value });
  }
  passwordWritten(e) {
    this.setState({ password: e.target.value });
  }

  submitHandler(e) {
    e.preventDefault();
    //oganij token od backu, zapisz go i używaj :D no i przekieruj na koniec na strone użytkownika
  }

  submitRegister() {
    //obsluga ll;afsdjkf;jasdklfja;klfj wyjeb to
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12 mt-5"> </div>
        <div className="col-md-5 mt-5"> </div>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="text-white"> Email address </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={this.emailWritten}
            />
            <Form.Text className="text-muted">
              We 'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="text-white"> Password </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.passwordWritten}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="text-white"> Repeat password </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.passwordWritten}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onSubmit={this.submitHandler}>
            Register
          </Button>
        </Form>
      </div>
    );
  }
}
