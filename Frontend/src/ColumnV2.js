const ColumnV2 = ({ name, tasks }) => (
    <div>
        <h2 class="text-center text-white">{name}</h2>
        {tasks.map((item, index) => {
            return (
                <div className="center">
                    <div className="p">
                        {item} + {index}

                    </div>
                </div>
            );
        })}
    </div>

);
export default ColumnV2;