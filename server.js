require('dotenv').config();
const PORT = process.env.PORT;
//require the module installed('express-session')
const session = require('express-session')

const express = require('express');
const app = express();

const bills = require('./models/seed.js'); // connected all bills



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


//MIDDLEWARES

//custom middleware, every request passes through it
app.use ((req, res, next) => {
  console.log("Here is req", req.body)
  //this sends the request on the next step in the process
  next()
});

// set up static assets(images/css/client-side JS/etc)
app.use(express.static('public'));

//set up materialize css
app.use(express.static('node_modules/materialize-css/dist'));

//set up calendar module
app.use('/fullcalendar', express.static('node_modules/fullcalendar/'));

//interpreting incoming request as JSON
app.use(express.json());
//allows to preceive the incoming object as a string or array
//this will parse the data and create the "req.body object"
app.use(express.urlencoded({extended: true}));

app.use( session ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  }));


//CONTROLLERS

//requiring bills.js controller
const billsController = require('./controllers/bills.js');
app.use('/bills', billsController)

const usersController = require('./controllers/users.js')
app.use('/users', usersController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

//homepage route
app.get('/', (req, res) => {
  res.render('sessions/new.ejs', {
    currentUser: req.session.currentUser
  })
})

app.listen(PORT, () => {
  console.log("Server is listening")
})
