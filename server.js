const express = require('express');
const app = express();
const bills = require('./models/seed.js'); // connected all bills

//allows for use of PUT and DELETE requests on our forms
const methodOverride = require("method-override");
app.use(methodOverride('_method'));

//interpreting incoming request as JSON
app.use(express.json());
//allows to preceive the incoming object as a string or array
app.use(express.urlencoded({extended: true}));

//index route
app.get('/bills', (req, res) => {
  res.render('index.ejs', {
    allBills: bills
  });
});

//new route
app.get('/bills/new', (req, res) => {
  res.render('new.ejs')
})
//create route
app.post('/bills', (req, res) => {
  bills.push(req.body)
  res.redirect('/bills')
})

//show route
app.get('/bills/:index', (req, res) => {
  res.render('show.ejs', {
    singleBill: bills[req.params.index],
    index: req.params.index
  });
});

//delete route
app.delete('/bills/:index', (req, res) => {
  bills.splice(req.params.index, 1)//remove an element from the array
  res.redirect('/bills')
})









app.listen(3000, () => {
  console.log("Server is listening")
})
