import React from "react";
import {  Button } from "react-bootstrap";
import Cookie from "js-cookie";



export default class InputFileButton extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      boardName: props.boardName,
      taskName: props.taskName,
      columnName: props.columnName
    }

    
    this.fileUpload = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleInputFileChange = this.handleInputFileChange.bind(this);
  }
  componentDidMount(){
    Cookie.set("boardName",this.state.boardName);
    Cookie.set("columnName",this.state.columnName);
    Cookie.set("taskName",this.state.taskName)
  }
  componentWillReceiveProps(nextProps){
    Cookie.set("boardName",nextProps.boardName);
    Cookie.set("columnName",nextProps.columnName);
    Cookie.set("taskName",nextProps.taskName)
    
  }

  handleButtonClick(e) {
    this.fileUpload.current.click();
    // fetch("http://localhost:3001/addAttachment" + "?token=" + Cookie.get("token"), {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     boardName: this.state.boardName,
    //     columnName: this.state.columnName,
    //     taskName: this.state.taskName,
    //     urlOrPath: ""//jak tu do choja dać te data z funkcji poniżej???
    //   })
    //});
  }

  handleInputFileChange(files) {
    var f;

    for (let i = 0, f = files[i]; i != files.length; ++i) {
      var reader = new FileReader();
      var name = f.name;
      console.log("name: "+name);
      console.log("f.path: "+f.path)
      reader.onload = function(e) {
        var data = e.target.result;

       // console.log(data);
        var b = Cookie.get("boardName");
        var c = Cookie.get("columnName");
        var t =Cookie.get("taskName");
        console.log("b= "+b+" c= "+c+" t= "+t+" \ndata: "+data);
          fetch("http://localhost:3001/addAttachment" + "?token=" + Cookie.get("token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: b,
        columnName: c,
        taskName: t,
        urlOrPath: data
      })
    }).then(response => response.json())
    .then(data => {
      var obj = JSON.stringify(data);
      var parsedJSON = JSON.parse(obj);
     // this.setState({tasks :[]})
    //  this.setState(state => {            //w parsed JSON jest dodany plik, ale trzeba by go jeszce doddać do najsze listy co jest w card(to co zakomnetowane)
    //   const list = state.attachments.push(parsedJSON);
    //   return {
    //     list
    //   };
    // });   
    });
        /* DO SOMETHING WITH workbook HERE */
      };
      reader.readAsBinaryString(f);
    }
    //alert(${files[0].name} ${files[0].bytes});
  }

  render() {
    return (
      <div>
        <Button
          variant={this.props.buttonClass}
          onClick={this.handleButtonClick}
        >
          Dodaj attachment
        </Button>
        <input
          type="file"
          name="my_file"
          //accept="plik/xlsx" //to niestety chyba nie działą...
          onChange={e => this.handleInputFileChange(e.target.files)}
          ref={this.fileUpload}
          style={{ visibility: "hidden", display: "none" }}
        />
      </div>
    );
  }
}