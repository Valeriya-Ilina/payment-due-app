const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/users.js');

//GET/new to render a form for the user be able to log in.
router.get('/new', (req, res) => {
  res.render('/sessions/new.ejs', {
    currentUser: req.session.currentUser
  });
});


//log in
router.post('/', (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    //if database is not working
    if (err) {
      console.log(err)
      res.send('Something went wrong. Try again later')
      //if user is not found
    } else if (!foundUser) {
      res.send('<a href="/">Sorry, user not found </a>')
      //user is found
    } else {
      //check the password if it is match
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        //add the user to our session
        req.session.currentUser = foundUser
        res.redirect('/bills')
      } else {
        //password do not match
        res.send('<a href="/">Wrong password</a>')
      };
    };
  });
});

//log out
router.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

module.exports = router
