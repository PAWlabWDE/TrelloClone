import React from "react";
import "./xxxxddd.css";
import Card from "./Card.js"
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'



const ColumnV2 = ({ name, tasks }) => (
    <DndProvider backend={Backend}>
  <div className="lista"  >
      <div>
    <h2 class="text-center text-white">{name}</h2>
    </div>
    {tasks.map((item, index) => {
      return (
        <div  className="karta" >
          <div className="p">
            <div class="text-center text-white">
                <Card text={item["nazwaZadania"]}/>
              {/* {item["nazwaZadania"]} + {index} */}
            </div>
          </div>
        </div>
      );
    })}
  </div>
  </DndProvider>
);
export default ColumnV2;
