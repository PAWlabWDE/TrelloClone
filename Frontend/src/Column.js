import React, { Component } from "react";
import ScrollbarSize from 'react-scrollbar-size';

const styles = {
	margin: '1rem',
	textAlign: 'center',
};

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state={
        boardName:props.boardName
    };
    this.props = {
      columnName: props.name,
      taks: props.tasks
    };
  }
  initialMeasurements = {};
  state = {};

  scrollbarSizeLoad = measurements => {
		this.handleUpdate(measurements);
		this.initialMeasurements = measurements;
	};

	scrollbarSizeChange = measurements => {
		this.handleUpdate(measurements);
	};

	handleUpdate = ({ scrollbarHeight, scrollbarWidth }) => {
		if (scrollbarHeight !== this.state.height || scrollbarWidth !== this.state.width) {
			this.setState({
				height: scrollbarHeight,
				width: scrollbarWidth,
			});
		}
	};
  
  scrollbarSizeLoad = measurements => {
    this.handleUpdate(measurements);
    this.initialMeasurements = measurements;
};

scrollbarSizeChange = measurements => {
    this.handleUpdate(measurements);
};

handleUpdate = ({ scrollbarHeight, scrollbarWidth }) => {
    if (scrollbarHeight !== this.state.height || scrollbarWidth !== this.state.width) {
        this.setState({
            height: scrollbarHeight,
            width: scrollbarWidth,
        });
    }
};
  render() {
    // return (
    //     <div style={styles}>
    //         <h2>React Scrollbar Size Demo</h2>
    //         <h4>Tip: Change browser zoom level to see scrollbar sizes change.</h4>
    //         <ScrollbarSize onLoad={this.scrollbarSizeLoad} onChange={this.scrollbarSizeChange} />
    //         <p>
    //             {`The initial height of the scrollbar was ${this.initialMeasurements.scrollbarHeight}px.`}
    //             <br />
    //             {`The initial width of the scrollbar was ${this.initialMeasurements.scrollbarWidth}px.`}
    //             <br />
    //             {`The current height of the scrollbar is ${this.state.height}px.`}<br />
    //             {`The current width of the scrollbar is ${this.state.width}px.`}
    //         </p>
    //     </div>
    // );
     return( <div>
  <h2 class="text-center text-white">{this.props.columnName}</h2>
       {this.state.tasks.map((item, index) => {
            return (
              <div className="center">
                <div className="p">
                  {item}
                  
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}



