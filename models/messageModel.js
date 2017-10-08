var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
  message: {
    type: String
  },
  client: {
    type: Schema.ObjectId,
    ref: 'Client'
  },
  read: {
    type: Boolean,
    default: false
  },
  creative: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
