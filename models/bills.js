const mongoose = require('mongoose');
const {Schema, model} = mongoose;

//create Schema
const billSchema = new Schema ({
  name: {type: String, required: true},
  billAmount: {type: Number, required: true},
  dueDate: {type: Date, required: true},
  autopay: {type: Boolean, default: false},
  payMethod: String,
  notes: String
});

const Bill = model('Bill', billSchema);

module.exports = Bill;
