import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

export default class Loginn extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.emailWritten = this.emailWritten.bind(this);
    this.passwordWritten = this.passwordWritten.bind(this);
  }
  emailWritten(e) {
    this.setState({ email: e.target.value });
  }
  passwordWritten(e) {
    this.setState({ password: e.target.value });
  }
  render() {
    return (
      <div className="row">
        <div className="col-md-4 mt-5"></div>
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
          <Button variant="primary" type="submit">
            Zaloguj
          </Button>
        </Form>
      </div>
    );
  }
}
