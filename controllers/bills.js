const express = require('express');
const router = express.Router();
const seed = require('../models/seed.js');
const Bill = require('../models/bills.js').Bill;
const PaymentHistory = require('../models/bills.js').PaymentHistory;

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/')
  };
};

//date formating
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(utc);
dayjs.extend(customParseFormat);

//CONTROLLERS

//seed data to the database for testing purposes
router.get('/seed', isAuthenticated, (req, res) => {
  //assign seed data to each user personally
  seed.forEach((obj) => {
    obj.user = req.session.currentUser
  })
  Bill.create(seed, (err, data) => {
    res.redirect('/bills')
  });
});

//index route
router.get('/', isAuthenticated, (req, res) => {
  //res.render('bills/index.ejs', {
    //allBills: bills
  //});
  Bill.find( { user: req.session.currentUser }, (err, foundBills) => {
    if(err) {
      console.log(err)
      next(err)
    } else {
      res.render('bills/index.ejs', {
        currentUser: req.session.currentUser,
        allBills: foundBills,
        dayjs: dayjs
      });
    };
    //sort by month
  }).sort( { dueDate: 1 } );
});

//new route
router.get('/new', isAuthenticated, (req, res) => {
  res.render('bills/new.ejs', {
    currentUser: req.session.currentUser
  });
});
//create route using post method
router.post('/', isAuthenticated, (req, res) => {
  //bills.push(req.body)
  // add new item to Bills
  if(req.body.autopay === 'on') {
    req.body.autopay = true
  } else {
    req.body.autopay = false
  }
  //format the Date
  req.body.dueDate = dayjs.utc(req.body.dueDate,"MMM DD, YYYY")
    //console.log(req.body)
  req.body.user = req.session.currentUser
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
router.get('/:index', isAuthenticated, (req, res) => {
  Bill.findById(req.params.index, (err, foundBill) => {

    // sorts paymentHistory array by date from newest to oldest
    foundBill.paymentHistory.sort((payment1, payment2) => payment2.paymentDay - payment1.paymentDay);
    res.render('bills/show.ejs', {
      currentUser: req.session.currentUser,
      singleBill: foundBill,
      index: req.params.index,
      dayjs: dayjs
    });
  });
});

//delete route
router.delete('/:index', isAuthenticated, (req, res) => {
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
router.get('/:index/edit', isAuthenticated, (req,res) => {
  Bill.findById(req.params.index, (err, foundBill) => {
    res.render('bills/edit.ejs', {
      currentUser: req.session.currentUser,
      singleBill: foundBill,
      index: req.params.index,
      dayjs: dayjs
    });
  });
});
//put route
//when we do edit, we change autopay value
router.put('/:index', isAuthenticated, (req, res) => {
  if(req.body.autopay === 'on'){
    req.body.autopay = true
  } else {
    req.body.autopay = false
  }
  //format the Date
  req.body.dueDate = dayjs.utc(req.body.dueDate,"MMM DD, YYYY")
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

router.put('/:index/pay', isAuthenticated, (req, res) => {
  //get data from url query params, e.g. ...?_method=PUT&dueDate=Tue Aug 03 2021 19:00:00 GMT-0400 (Eastern Daylight Time)
  // change string to date object and convert to UTC format
  const date = dayjs.utc(req.query.dueDate)
  // get month mumber and increment (month count starts with 0)
  const nextMonthNumber = dayjs(date).get('month') + 1
  // set the date to be next month
  const nextDueDate = dayjs(date).month(nextMonthNumber)

  // collecting data together for db update (dueDate and paymentHistory)
  const paymentHistory = {
    paymentDay: date,
    paymentAmount: req.query.paymentAmount,
    payMethod: req.query.payMethod
  }

  Bill.findByIdAndUpdate(req.params.index, { dueDate: nextDueDate, $push: { paymentHistory: paymentHistory }}, { new: true }, (err, updatedBill) => {
    if(err) {
      console.log(err)
    } else {
      res.redirect('/bills')
    };
  });
});

module.exports = router;
