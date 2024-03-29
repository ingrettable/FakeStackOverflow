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
    maxlength: 140,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ask_date_time: {
    type: Date,
    default: new Date(),
  },
  views: {
    type: Number,
    default: 0,
    //required: true,
  },
  upvoted_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  downvoted_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

questionSchema.virtual('votes').get(function() {
  return this.upvoted_by.length - this.downvoted_by.length;
});

// Define a virtual property for the URL
questionSchema.virtual('url').get(function() {
  return `posts/question/${this._id}`;
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
