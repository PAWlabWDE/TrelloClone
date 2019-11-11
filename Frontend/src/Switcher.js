import { BrowserRouter as  Switch, Route } from "react-router-dom";
import React, { Component } from 'react';
const API = 'http://localhost:3001';
const DEFAULT_QUERY = '/getAllBoards';  
export default class Switcher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            text: ''
        }

    }
    componentDidMount() {
        console.log("wywyoalja siie SWITCHER");
        fetch(API + DEFAULT_QUERY)
        .then(response => response.json())
        .then(data => this.setState({ list: data }));
      }
    render() {
        return (
            <Switch>
                {this.state.list.map((item, index) => {
                    var linkAdddres = "/".concat(item);
                    console.log(linkAdddres);
                    return (
                        <Route exact path={linkAdddres}>
                            {item}
                        </Route>
                    )
                })}
            </Switch>);
    }
}