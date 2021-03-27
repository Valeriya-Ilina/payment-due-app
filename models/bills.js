const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// create Payment History Schema
const paymentHistorySchema = new Schema ({
  paymentDay: {type: Date, required: true},
  paymentAmount: {type: Number, required: true},
  payMethod: String
}, { timestamps: true })

// create Bill Schema
const billSchema = new Schema ({
  name: {type: String, required: true},
  billAmount: {type: Number, required: true},
  dueDate: {type: Date, required: true},
  autopay: {type: Boolean, default: false},
  payMethod: String,
  notes: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  paymentHistory: [paymentHistorySchema]
}, { timestamps: true });


const Bill = model('Bill', billSchema);
const PaymentHistory = model('PaymentHistory', paymentHistorySchema)

module.exports = { Bill, PaymentHistory };
