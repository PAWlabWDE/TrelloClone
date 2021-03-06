import React from "react";
import { Button } from "react-bootstrap";

export default class InputFileButton extends React.Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleInputFileChange = this.handleInputFileChange.bind(this);
  }

  handleButtonClick(e) {
    this.fileUpload.current.click();
  }

  handleInputFileChange(files) {
    var f;
    var convertedFiles = [];
    for (let i = 0, f = files[i]; i != files.length; ++i) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        convertedFiles[i] = {
          name: f.name,
          size: f.size,
          type: f.type,
          binaryData: data
        };
      };
      reader.readAsBinaryString(f);
      this.props.funkcjaObslugujacaPliki(convertedFiles);
    }
    //alert(`${files[0].name} ${files[0].bytes}`);
  }

  render() {
    return (
      <div>
        <Button
          variant={this.props.buttonClass}
          onClick={this.handleButtonClick}
        >
          Dodaj plik{" "}
        </Button>{" "}
        <input
          type="file"
          name="my_file"
          accept="plik/xlsx" //to niestety chyba nie działą...
          onChange={e => this.handleInputFileChange(e.target.files)}
          ref={this.fileUpload}
          style={{ visibility: "hidden", display: "none" }}
        />{" "}
      </div>
    );
  }
}
