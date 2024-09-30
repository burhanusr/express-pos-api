const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tag must have a name'],
    unique: true,
    trim: true,
    maxLength: [20, 'A tag name must have less or equal then 20 characters'],
    minLength: [3, 'A tag name must have more or equal then 3 characters'],
  },
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
