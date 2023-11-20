// Tag Document Schema
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // maxlength: 11,
    unique: true
  },
});

// Define a virtual property for the URL
tagSchema.virtual('url').get(function() {
  return `posts/tag/${this._id}`;
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
