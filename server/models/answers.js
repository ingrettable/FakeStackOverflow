// Answer Document Schema
const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  ans_by: {
    type: String,
    required: true
  },
  ans_date_time: {
    type: Date,
    default: new Date(),
    // required: true
  },
});

// Define a virtual property for the URL
answersSchema.virtual('url').get(function() {
  return `posts/answer/${this._id}`;
});

const Answer = mongoose.model('Answer', answersSchema);

module.exports = Answer;