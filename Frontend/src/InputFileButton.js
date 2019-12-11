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
    this.addAttachmentHandler = this.addAttachmentHandler.bind(this);
  }
  addAttachmentHandler(){
    fetch("http://localhost:3001/addAttachment" + "?token=" + Cookie.get("token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardName: this.props.boardName,
        columnName: this.state.columnName,
        taskName: this.state.taskName,
        urlOrPath: ""//TUTAJ musimy dać chyab ścieżę do pliku
      })
    });
  }

  handleButtonClick(e) {
    this.fileUpload.current.click();
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

        console.log(data);

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