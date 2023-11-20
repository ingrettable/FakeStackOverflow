// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  text: {
    type: String,
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  }],
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  asked_by: {
    default: 'Anonymous',
    type: String,
    //required: true,
  },
  ask_date_time: {
    type: Date,
    default: new Date(),
    //required: true,
  },
  views: {
    type: Number,
    default: 0,
    //required: true,
  },
});

// Define a virtual property for the URL
questionSchema.virtual('url').get(function() {
  return `posts/question/${this._id}`;
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
