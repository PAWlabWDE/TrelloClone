// import React, { Component } from "react";
// import { BrowserRouter as Link } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import "./Todo.css";
// import "./App.css";
// const API = "http://localhost:3001";

// class BoardLink extends Component {
//   constructor(props) {
//     super(props);

//     this.props = {
//       name: props.name
//     };
//   }
//   handleSubmit(e) {
//     e.preventDefault();

//     fetch(API + "/chooseBoard", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         boardName: this.state.text
//       })
//     });
//   }
//   render() {
//     var linkAdddres = "/".concat(this.props.name);
//     console.log("Board Link: " + linkAdddres);

//     return (
//         <div className="center">
//           <p>
//           <a href={linkAdddres}>
//             <Button bsStyle="primary"> {this.props.name} </Button>
//           </a>
//           </p>     
//         </div>  
//     );
//   }
// }

// export default BoardLink;
