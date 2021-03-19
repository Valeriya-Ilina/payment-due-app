const express = require('express');
const router = express.Router();
const seed = require('../models/seed.js');
const Bill = require('../models/bills.js');


//CONTROLLERS

//seed data to the database for testing purposes
router.get('/seed', (req, res) => {
  Bill.create(seed, (err, data) => {
    res.redirect('/bills')
  });
});

//index route
router.get('/', (req, res) => {
  //res.render('index.ejs', {
    //allBills: bills
  //});
  Bill.find( {}, (err, foundBills) => {
    if(err) {
      console.log(err)
      next(err)
    } else {
      res.render('index.ejs', {
        allBills: foundBills
      });
    };
  });
});

//new route
router.get('/new', (req, res) => {
  res.render('new.ejs')
});
//create route using post method
router.post('/', (req, res) => {
  //bills.push(req.body)
  // add new item to Bills
  if(req.body.autopay === 'on') {
    req.body.autopay = true
  } else {
    req.body.autopay = false
  }
    //console.log(req.body)
  Bill.create(req.body, (err, createdBill) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else {
      console.log(createdBill)
      res.redirect('/bills')
    };
  });
});

//show route
router.get('/:index', (req, res) => {
  Bill.findById(req.params.index, (err, foundBill) => {
    console.log(foundBill)
    res.render('show.ejs', {
      singleBill: foundBill,
      index: req.params.index
    });
  });
});

//delete route
router.delete('/:index', (req, res) => {
  Bill.findByIdAndRemove(req.params.index, (err, data) => {
    if(err) {
      console.log(err)
    } else {
      //bills.splice(req.params.index, 1)//remove an element from the array
      res.redirect('/bills')
    };
  });
});

//edit route
router.get('/:index/edit', (req,res) => {
  Bill.findById(req.params.index, (err, foundBill) => {
    res.render('edit.ejs', {
      singleBill: foundBill,
      index: req.params.index
    });
  });
});
//put route
//when we do edit, we change autopay value
router.put('/:index', (req, res) => {
  if(req.body.autopay === 'on'){
    req.body.autopay = true
  } else {
    req.body.autopay = false
  }
  //console.log(req.body)
  Bill.findByIdAndUpdate(req.params.index, req.body, { new: true }, (err, updatedBill) => {
    // submit the form and update the whole product
    updatedBill.name = req.body.name
    updatedBill.billAmount = req.body.billAmount
    updatedBill.dueDate = req.body.dueDate
    updatedBill.autopay = req.body.autopay
    updatedBill.payMethod = req.body.payMethod
    updatedBill.notes = req.body.notes
    res.redirect(`/bills/${req.params.index}`)
  });
});

router.put('/:index/pay', (req, res) => {
  //get data from url query params, e.g. ...?_method=PUT&dueDate=Tue Aug 03 2021 19:00:00 GMT-0400 (Eastern Daylight Time)
  //change string to date object
  let nextDueDate = new Date(req.query.dueDate)
  nextDueDate.setMonth(nextDueDate.getMonth() + 1)

  Bill.findByIdAndUpdate(req.params.index, { dueDate: nextDueDate}, { new: true }, (err, updatedBill) => {
    if(err) {
      console.log(err)
    } else {
      res.redirect('/bills')
    };
  });
});

module.exports = router;
