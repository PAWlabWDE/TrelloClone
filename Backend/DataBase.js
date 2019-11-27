const mongoose = require("mongoose");


function connect(){
    
mongoose.connect('mongodb+srv://test:test@cluster0-8ecx4.azure.mongodb.net/test?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("Connection Successful!");
});
}
function insert(){
    // define Schema
    var BookSchema = mongoose.Schema({
        name: String,
        price: Number,
        quantity: Number
    });

    // compile schema to model
    var Book = mongoose.model('Book', BookSchema, 'bookstore');

    // a document instance
    var book1 = new Book({ name: 'Introduction to Mongoose', price: 10, quantity: 25 });

    // save model to database
    book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
    });
}

export function insert();
export function connect();