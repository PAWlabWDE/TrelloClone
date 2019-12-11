// // Let's make <Card text='Write the docs' /> draggable!

// import React from 'react'
// import { useDrag } from 'react-dnd'
// import { ItemTypes } from './Constants'

// /**
//  * Your Component
//  */

import React from 'react'
import { DragSource } from 'react-dnd'
import { useDrag } from 'react-dnd'
import Popup from "reactjs-popup";
import { Button } from "react-bootstrap";

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
  CARD: 'card',
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
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
    console.log("drop REsult: "+item.id +"   "+ dropResult.listId)
   // CardActions.moveCardToList(item.id, dropResult.listId)
  },
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
  }
}

// function Card(props,text) {
//   // Your component receives its own props as usual
//   const { id } = props

//   // These two props are injected by React DnD,
//   // as defined by your `collect` function above:
//   const { isDragging, connectDragSource } = props

//   return connectDragSource(
//     <div>
//       {text}
//       {isDragging && ' (and I am being dragged now)'}
//     </div>,
//   )
// }

 function Card({ isDragging, text }) {
 
    const [{ opacity }, dragRef] = useDrag({
      item: { type: Types.CARD, text },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    })
    return (
      <div ref={dragRef} style={{ opacity }} >
        {text}
        <Popup modal trigger={<Button>Details</Button>}>
    <h2 class="text-center text-white">{text}</h2>
    <Button>FUCK THIS SHIT</Button>
      </Popup>
        }
      </div>
    )
  }

// Export the wrapped version
export default DragSource(Types.CARD, cardSource, collect)(Card)