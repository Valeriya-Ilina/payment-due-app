require('dotenv').config();
const PORT = process.env.PORT;


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
const mongoURI = process.env.MONGODBURI;
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

// set up static assets(images/css/client-side JS/etc)
app.use(express.static('public'));

//interpreting incoming request as JSON
app.use(express.json());
//allows to preceive the incoming object as a string or array
//this will parse the data and create the "req.body object"
app.use(express.urlencoded({extended: true}));


//CONTROLLERS
app.use('/bills', billControllers)

const userController = require('./controllers/users.js')
app.use('/users', userController)

app.listen(PORT, () => {
  console.log("Server is listening")
})
