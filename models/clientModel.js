var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = Schema({
  companyName: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    default: '',
    unique: 'This email already exists'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  reachBy: {
    type: String,
    trim: true,
    default: ''
  },
  howDidClientHear: {
    type: String,
    trim: true,
    default: ''
  },
  jobs: {
    type: Array,
    default: []
  },
  isClientProfileVerified: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', ClientSchema);
