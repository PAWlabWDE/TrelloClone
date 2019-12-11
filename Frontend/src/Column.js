import React from "react";
import "./xxxxddd.css";
import Card from "./Card.js"
import { DragSource } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { Cell as ColTable } from 'react-sticky-table';
import { Button } from "react-bootstrap";
import Popup from "reactjs-popup";

const Types = {
    COLUMN: 'column',
  }

  const cardSource = {
    beginDrag(props) {
      // Return the data describing the dragged item
      const item = { id: props.id }
      return item
    },
  
    endDrag(props, monitor, component) {
      if (!monitor.didDrop()) {
        return
      }
  
      // When dropped on a compatible target, do something
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
     // CardActions.moveCardToList(item.id, dropResult.listId)
    },
  }
  function collect(connect, monitor) {
    return {
      // Call this function inside render()
      // to let React DnD handle the drag events:
      connectDragSource: connect.dragSource(),
      // You can ask the monitor about the current drag state:
      isDragging: monitor.isDragging(),
    }
  }
function addNewCard(){
  console.log("dodaje nową kartę")
}
function Column  ({ name, tasks })  {
    const [{ opacity }, dragRef] = useDrag({
        item: { type: Types.COLUMN },
        collect: monitor => ({
          opacity: monitor.isDragging() ? 0.5 : 1,
        }),
      })
return(
  <ColTable>
  <div className="lista" ref={dragRef} style={{ opacity }} >
      <div>
    <h2 class="text-center text-white">{name}</h2>
    </div>
    {tasks.map((item, index) => {
      return (
        <div  className="karta" >
          <div className="p">
            <div class="text-center text-white">
            <Popup
    trigger={<Button variant="success"> {item["nazwaZadania"]}</Button>}
    position="top center"
    closeOnDocumentClick
  >
                <Card text={item["nazwaZadania"]}/>
                
      </Popup>
            </div>
          </div>
        </div>
      );
    })}
    <div>
      <Button value="New card" variant="secondary" size="sm" onClick={addNewCard}>New card</Button>
    </div>
  </div>
  </ColTable>
)
}
export default DragSource(Types.COLUMN, cardSource, collect)(Column);
