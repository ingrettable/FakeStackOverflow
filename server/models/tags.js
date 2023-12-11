// Tag Document Schema
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // maxlength: 11,
    unique: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Define a virtual property for the URL
tagSchema.virtual('url').get(function() {
  return `posts/tag/${this._id}`;
});

// define virtual property title which is the same as name
tagSchema.virtual('title').get(function() {
  return this.name;
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
