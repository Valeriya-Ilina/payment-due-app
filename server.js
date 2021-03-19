const express = require('express');
const app = express();
const bills = require('./models/seed.js'); // connected all bills

//requiring bills.js controller
const billControllers = require('./controllers/bills');

//allows for use of PUT and DELETE requests on our forms
const methodOverride = require("method-override");
app.use(methodOverride('_method'));

//set up database
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/payment-due-app";
const db = mongoose.connection;

mongoose.connect(mongoURI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('database connection checked');
});

//helps to understand mistakes, connection  and disconnection in terminal
db.on('error', (err) => {console.log("ERROR: ", err)});
db.on('connected', () => {console.log('mongo connected')});
db.on('disconnected', () => {console.log('mongo disconnected')});

//custom middleware, every request passes through it
app.use ((req, res, next) => {
  console.log("Here is req", req.body)
  //this sends the request on the next step in the process
  next()
});

//interpreting incoming request as JSON
app.use(express.json());
//allows to preceive the incoming object as a string or array
app.use(express.urlencoded({extended: true}));


//CONTROLLERS
app.use('/bills', billControllers)


app.listen(3000, () => {
  console.log("Server is listening")
})
