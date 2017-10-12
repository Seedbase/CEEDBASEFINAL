var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  displayName: {
    type: String
  },
  image: {
    type: String
  },
  email: {
    type: String,
    default: ''
  },
  provider: {
    type: String,
    default: ''
  },
  facebook:{
      type: Object
  },
  google:{
      type: Object
  },
  twitter:{
      type: Object
  },
  linkedIn: {
    type: Object
  },
  linkedInProfile: {
      type: String
  },
  isUserProfileActive: {
    type: Boolean,
    default: false
  },
  isUserProfileAuthenticated: {
    type: Boolean,
    default: false
  },
  userProfileAuthenticatedBy: {
    type: String,
    trim: true,
    default: ''
  },
  isUserSkillsAuthenticated: {
    type: Boolean,
    default: false
  },
  isUserExternalLinksAuthenticated : {
    type: Boolean,
    default: false
  },
  isUserServicesAuthenticated : {
    type: Boolean,
    default: false
  },
  isUserPortfoliosAuthenticated : {
    type: Boolean,
    default: false
  },
  isUserExperiencesAuthenticated : {
    type: Boolean,
    default: false
  },
  providerId : {
    type: String
  },
  profile: {
    
  }
});

module.exports = mongoose.model('User', UserSchema);
