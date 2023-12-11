// Answer Document Schema
const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  comment_by: {
    // type: String,
    // required: true
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comment_date_time: {
    type: Date,
    default: new Date(),
    // required: true
  },
});

// Define a virtual property for the URL
commentsSchema.virtual('url').get(function() {
  return `posts/comment/${this._id}`;
});

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;
