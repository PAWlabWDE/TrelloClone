import React from "react";
const ColumnV2 = ({ name, tasks }) => (
    <div>
        <h2 class="text-center text-white">{name}</h2>
        {tasks.map((item, index) => {
            return (
                <div className="center">
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