CREATE TABLE [IF NOT EXISTS] Column(
    column_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    //ma wiele zadań
);

CREATE TABLE [IF NOT EXISTS] Board(
    board_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    //ma wiele kolumn
);