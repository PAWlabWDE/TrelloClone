import React from "react";
import "./xxxxddd.css";

const ColumnV2 = ({ name, tasks }) => (
  <div className="lista"  >
      <div>
    <h2 class="text-center text-white">{name}</h2>
    </div>
    {tasks.map((item, index) => {
      return (
        <div  className="karta" >
          <div className="p">
            <div class="text-center text-white">
              {item["nazwaZadania"]} + {index}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
export default ColumnV2;
