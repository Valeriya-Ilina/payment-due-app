const express = require('express');
const app = express();
const bills = require('./models/seed.js') // connected all bills

//index route
app.get('/bills', (req, res) => {
  res.render('index.ejs', {
    allBills: bills
  });
});










app.listen(3000, () => {
  console.log("Server is listening")
})
