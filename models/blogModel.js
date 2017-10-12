var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlogSchema = Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  image: {
  },
  creator: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
