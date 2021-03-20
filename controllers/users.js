const bcrypt = require('bcrypt');
const express = require('express');
const users = express.Router();
const User = require('../models/users.js');

// route to show Create User page
users.get('/signup', (req, res) => {
  res.render('users/signup.ejs', {
    currentUser: req.session.currentUser
  });
});

//create user
users.post('/', (req, res) => {
  console.log(req.body)
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
    console.log('user is created', createdUser)
    res.redirect('/')
  });
});


module.exports = users;
