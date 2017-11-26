/**
 * Created by Dorcas Onuh on 2017-06-12.
 */
var path = require('path');
var express = require('express');
var ejs = require("ejs");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var config = require(path.resolve('./config/config'));
var nodemailer = require('nodemailer');
var multer = require('multer');
var mg = require('nodemailer-mailgun-transport');
var nodemailerMailgun = nodemailer.createTransport(mg(config.mailgun));
//modules for this project.
var passport = require('passport');
var session = require('express-session');
var db = mongoose.connect('mongodb://localhost/socialLogin');
// var db = mongoose.connect('mongodb://admin:mLab3000@ds117909.mlab.com:17909/ceedbase');

var index = require('./routes/index');
var profiles = require('./routes/profiles');
var auth = require('./routes/auth');
var client = require('./routes/client');
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname +'/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
  secret: 'cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: false }
}));

// config file for all social networkAPIs
require('./config/passport')(app);

// app.use('/', index);
app.use('/profiles', profiles);
app.use('/auth', auth);
app.use('/client', client);


app.get('/', function (req,  res) {
	User.find({$or: [{'isUserProfileAuthenticated':true}, {'isUserSkillsAuthenticated':true}, {'isUserExternalLinksAuthenticated': true}, {'isUserServicesAuthenticated': true}, {'isUserPortfoliosAuthenticated': true}, {'isUserExperiencesAuthenticated': true}]	}).exec(function (err, users) {
		if (err) {
			res.render('index', {users: undefined});
		}
		else {
			res.render('index', {users: users});
		}

	})

});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/community', function (req, res) {
    res.render('community');
});

var User = mongoose.model('User');
app.get('/profile', function (req, res) {
    res.render('profile', {user:req.user});
});

app.get('/error', function (req, res) {
    res.render('common-error');
});


app.get('/profile/authentication', function (req, res) {
	User.findOne({_id: req.query.userId}).exec(function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			if (user.isUserProfileAuthenticated)
				res.render('common-error', {error: 'Creative profile is already authenticated'});
			else
				res.render('profile-authentication' , {user:user});
		} else
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
	});

});

app.get('/profile/view', function (req, res) {
	User.findOne({_id: req.query.userId}).exec(function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user)
			res.render('profile-view' , {user:user});
		else
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
	});

});
app.get('/profile/interest', function (req, res) {
	res.render('profile-interest');
});

app.post('/api/profile/video/upload', function (req, res) {
	var upload = multer(config.uploads.profiletVideoUpload).array('profileVideo');
	var newUUID = '';
	var size = '';
	var name = '';
	var profileVideoURL = '';
	var user = req.user;
	if (user) {
		uploadVideo()
	    .then(onUploadSuccess)
	    .catch(function (err) {
	      res.json(err);
	    });
	} else {
	    res.status(400).send({
	      message: 'User is not signed in'
	    });
	}

	function uploadVideo () {
	    return new Promise(function (resolve, reject) {
	        upload(req, res, function (uploadError) {
	        	if (uploadError) {
		          // Send error code as we are customising the error messages.
		          // reject(errorHandler.getErrorMessage(uploadError));
		          reject(uploadError.code);
		        } else {
		          newUUID = req.files[0].filename;
		          size = req.files[0].size;
		          name = req.files[0].originalname;
		          profileVideoURL = req.files[0].path;
		          resolve();
		        }
	      	});
	    });
	}

  	function onUploadSuccess () {
    	res.json({success: true, newUuid: newUUID, size: size, name: name, url: profileVideoURL});
    	return true;
  	}
});

app.get('/api/profile/video/upload/fetch/:userId', function (req, res) {
	if (req.params.userId) {
	    User.findOne({ '_id': req.params.userId }).exec(function (err, user) {
	      	if (err) {
	        	res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
	      	}
	      	if (user && user.profile && user.profile.videoResume) {
		      	var previouslyUploadedVideo = [];
		      	previouslyUploadedVideo.push(user.profile.videoResume)
		      	res.json(previouslyUploadedVideo);
	    	}
	    });
	} else {
	    res.json('');
	}
});

app.post('/profile/user/save', function (req, res) {
	console.log('dsds');
	User.findOne({providerId: req.body.providerId}).exec(function(err, user) {
		if (err) {
			res.render('profile' , {user:req.user});
		}
		user.profile = req.body.userProfile;
		user.save(function(err) {
			if (err){
				console.log('rrr' + err)
				res.render('profile' , {user:req.user});
			}
			console.log('dsdsds');
			res.render('profile' , {user:user});
		});
	});
})

app.post('/profile/authentication/request', function(req, res) {
	User.findOne({providerId: req.body.providerId}).exec(function(err, user) {
		if (err) {
			res.render('profile' , {user:req.user});
		}
		user.profile = req.body.userProfile;
		user.save(function(err) {
			if (err){
				res.render('profile' , {user:req.user});
			}
			ejs.renderFile(path.resolve('./views/authenticationRequestEmailTemplate.ejs'), {
		        name: req.body.dataString.fromName,
		        assetOneUrl: 'http://localhost:3000/profile/authentication?userId='+user._id,
		        appName: 'ceedbase',
		        url: 'http://localhost:3000/profile/authentication?userId=' + user._id
			}, function (err, emailHTML) {
				if (err) {
					res.render('profile' , {user:req.user});
				}
				//req.body.dataString.fromName + '<' +
			    nodemailerMailgun.sendMail({
				    from: req.body.dataString.fromName + '<' + req.body.dataString.fromEmail + '>',
				    to: req.body.dataString.toEmail, // An array if you have multiple recipients.
				    //cc:'',
				    //bcc:'',
				    subject: req.body.dataString.subject,
				    //You can use "html:" to send HTML email content. It's magic!
				    html: emailHTML,
				    //You can use "text:" to send plain-text content. It's oldschool!
				    //text: req.body.message
				}, function (err, info) {
				    if (err) {
				    	console.log(err);
				      res.render('profile' , {user:req.user});
				    }
				    else {
				      res.render('profile' , {user:user});
				    }
			  	});
			});
		});
	});
});

app.post('/profile/authenticate/user', function(req, res) {
	User.findOne({_id: req.body.user._id}).exec(function(err, user) {
		if (err) {
			res.render('profile-authentication' , {user:req.body.user});
		}
		user.profile = req.body.user.profile;
		user.isUserSkillsAuthenticated = req.body.user.isUserSkillsAuthenticated;
		user.isUserExternalLinksAuthenticated = req.body.user.isUserExternalLinksAuthenticated;
		user.isUserServicesAuthenticated = req.body.user.isUserServicesAuthenticated;
		user.isUserPortfoliosAuthenticated = req.body.user.isUserPortfoliosAuthenticated;
		user.isUserExperiencesAuthenticated = req.body.user.isUserExperiencesAuthenticated;
		user.save(function(err) {
			if (err){
				res.render('profile-authentication' , {user:req.body.user});
			}
			//req.body.dataString.fromName + '<' +
		    nodemailerMailgun.sendMail({
			    from: 'ceedbase <info@ceedbase.com>',
			    to: req.body.user.email, // An array if you have multiple recipients.
			    //cc:'',
			    //bcc:'',
			    subject: 'Some or all items of your profile are Authenticated',
			    //You can use "html:" to send HTML email content. It's magic!
			    html: 'Hello ' + req.body.user.displayName + ',<br>' +
			    	  'Congratulations!<br>' +
			    	  'Some or all of the items of your ceedbase profile are authenticated.<br>' +
			    	  'Please login to check the details. <br><br>' +
			    	  'Thank you.<br><br>' +
			    	  '- ceedbase'
			}, function (err, info) {
			    if (err)
			      res.render('profile-authentication' , {user:req.body.user});
			    else
			      res.render('profile-authentication' , {user:user});
		  	});
		});
	});
});

app.post('/profile/authenticate/complete/user', function(req, res) {
	console.log(JSON.stringify(req.body));
	User.findOne({_id: req.body.user._id}).exec(function(err, user) {
		if (err) {
			res.render('profile-authentication' , {user:req.body.user});
		}
		console.log(JSON.stringify(req.body.user));
		user.isUserProfileAuthenticated = true;
		user.userProfileAuthenticatedBy = req.body.authenticator.organisation;
		user.save(function(err) {
			if (err){
				res.render('profile-authentication' , {user:req.body.user});
			}
			//req.body.dataString.fromName + '<' +
		    nodemailerMailgun.sendMail({
			    from: 'ceedbase <info@ceedbase.com>',
			    to: req.body.user.email, // An array if you have multiple recipients.
			    //cc:'',
			    //bcc:'',
			    subject: 'Your complete profile is authenticated',
			    //You can use "html:" to send HTML email content. It's magic!
			    html: 'Hello ' + req.body.user.displayName + ',<br>' +
			    	  'Congratulations!<br>' +
			    	  'Your complete profile has been authenticated. <br><br>' +
			    	  'Thank you.<br><br>' +
			    	  '- ceedbase'
			}, function (err, info) {
			    if (err)
			      res.render('profile-authentication' , {user:req.body.user});
			    else
			      res.render('profile-authentication' , {user:user});
		  	});
		});
	});
});

app.get('/client-form', function (req, res) {
    res.render('clientForm');
});

app.post('/api/client/job/upload', function (req, res) {
	var upload = multer(config.uploads.clienJobDescUpload).array('clientJobFile');
	var newUUID = '';
	var size = '';
	var name = '';
	var jobFileUrl = '';
	var user = req.user;
	uploadFile()
    .then(onUploadSuccess)
    .catch(function (err) {
      res.json(err);
    });

	function uploadFile () {
	    return new Promise(function (resolve, reject) {
	        upload(req, res, function (uploadError) {
	        	if (uploadError) {
		          // Send error code as we are customising the error messages.
		          // reject(errorHandler.getErrorMessage(uploadError));
		          reject(uploadError.code);
		        } else {
		          newUUID = req.files[0].filename;
		          size = req.files[0].size;
		          name = req.files[0].originalname;
		          jobFileUrl = req.files[0].path;
		          resolve();
		        }
	      	});
	    });
	}

  	function onUploadSuccess () {
    	res.json({success: true, newUuid: newUUID, size: size, name: name, url: jobFileUrl});
    	return true;
  	}
});

var ClientModel = require('./models/clientModel');
app.post('/api/client/profile/request', function(req, res) {
	console.log('m i here?');
	var client = new ClientModel(req.body);

	client.save (function (err) {
		if (err){
			console.log(err);
			res.render('clientForm');
		}
		ejs.renderFile(path.resolve('./views/clientVerificationRequestTemplate.ejs'), {
	        name: 'ceedbase',
	        assetOneUrl: 'http://localhost:3000/client/verification?clientId='+client._id,
	        appName: 'ceedbase',
	        url: 'http://localhost:3000/client/verification?clientId=' + client._id
		}, function (err, emailHTML) {
			if (err) {
				console.log(err);
				res.render('clientForm');
			}
			//req.body.dataString.fromName + '<' +
		    nodemailerMailgun.sendMail({
			    from: 'ceedbase <verification@ceedbase.com>',
			    to: req.body.email, // An array if you have multiple recipients.
			    //cc:'',
			    //bcc:'',
			    subject: 'Just one step more! Verify yourself',
			    //You can use "html:" to send HTML email content. It's magic!
			    html: emailHTML,
			    //You can use "text:" to send plain-text content. It's oldschool!
			    //text: req.body.message
			}, function (err, info) {
			    if (err){
			    	console.log(err);
			    	res.render('clientForm');
			    }

			    else {
			      res.json('success');
			    }
		  	});
		});
	});
});

app.get('/client/verify/registration', function (req, res) {
	if (!req.query.clientEmail)
		return res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
	ClientModel.findOne({email: req.query.clientEmail}).exec(function (err, client) {
		if (err) {
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
		} else {
			if (client == null)
				res.json('client-not-found');
			else {
				if (!client.isClientProfileVerified)
					res.json('client-not-verified');
				else
					res.json('client-found')
			}
		}
	})
});

app.get('/client/verification', function (req, res) {
	ClientModel.findOne({_id: req.query.clientId}).exec(function(err, client) {
		if (err) {
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
		}
		if (client) {
			client.isClientProfileVerified = true;
			client.save(function (err) {
				if (err)
					res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
				res.redirect('/')

			});
		} else
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
	});

});

var MessageModel = require('./models/messageModel');
app.post('/user/profile/interest', function (req, res) {
	ClientModel.findOne({email: req.body.clientEmail}).exec(function(err, client) {
		if (err) {
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
		}
		var message = new MessageModel();
		message.message = req.body.message;
		message.client = client._id;
		message.creative = req.body.userId;
		message.save(function (err) {
			if (err)
				res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
			else
				res.json('success');
		});
	});
});

app.get('/profile/user/messages/fetch', function (req, res) {
	MessageModel.find({creative: req.user._id, read: false}).exec(function(err, messages) {
		if (err) {
			// do nothing
		} else {
			res.json(messages);
		}
	})
});

app.post('/profile/user/messages/markread', function (req, res) {
	console.log('i m here ' + JSON.stringify(req.body.messages));
	MessageModel.update({creative: {$in: req.body.messages}}, {$set: {"read": true}},{"multi": true}).exec(function(err, response) {
		if (err) {
			//do nothing
		} else
			res.json(response);
	});
});

app.post('/client/verification/resendemail', function (req, res) {
	ClientModel.findOne({email: req.body.clientEmail}).exec(function(err, client) {
		if (err) {
			res.render('common-error', {error: 'Something went wrong. Pleae try again.'});
		}
		ejs.renderFile(path.resolve('./views/clientVerificationRequestTemplate.ejs'), {
	        name: 'ceedbase',
	        assetOneUrl: 'http://localhost:3000/client/verification?clientId='+client._id,
	        appName: 'ceedbase',
	        url: 'http://localhost:3000/client/verification?clientId=' + client._id
		}, function (err, emailHTML) {
			if (err) {
				res.render('clientForm');
			}
			//req.body.dataString.fromName + '<' +
		    nodemailerMailgun.sendMail({
			    from: 'ceedbase <verification@ceedbase.com>',
			    to: req.body.email, // An array if you have multiple recipients.
			    //cc:'',
			    //bcc:'',
			    subject: 'Just one step more! Verify yourself',
			    //You can use "html:" to send HTML email content. It's magic!
			    html: emailHTML,
			    //You can use "text:" to send plain-text content. It's oldschool!
			    //text: req.body.message
			}, function (err, info) {
			    if (err) {
			      res.render('profile-view', {user: req.body.user});
			    }
			    else {
			      res.render('profile-view', {user: req.body.user});
			    }
		  	});
		});
	});
});

app.post('/api/admin/blog/image/upload', function (req, res) {
    var upload = multer(config.uploads.blogUpload).array('blogImage');
    var newUUID = '';
    var size = '';
    var name = '';
    var blogImageUrl = '';
    var user = req.user;
    uploadImage()
        .then(onUploadSuccess)
        .catch(function (err) {
            res.json(err);
        });

    function uploadImage () {
        return new Promise(function (resolve, reject) {
            upload(req, res, function (uploadError) {
                if (uploadError) {
                    // Send error code as we are customising the error messages.
                    // reject(errorHandler.getErrorMessage(uploadError));
                    reject(uploadError.code);
                } else {
                    newUUID = req.files[0].filename;
                    size = req.files[0].size;
                    name = req.files[0].originalname;
                    blogImageUrl = req.files[0].path;
                    resolve();
                }
            });
        });
    }

    function onUploadSuccess () {
        res.json({success: true, newUuid: newUUID, size: size, name: name, url: blogImageUrl});
        return true;
    }
});

app.get('/admin/blog/create', function (req, res) {
    res.render('create-blog-post');
});

var BlogModel = require('./models/blogModel');
app.post('/api/admin/blog/create', function (req, res) {
    var adminSecret = req.body.adminSecret;
    if (adminSecret == config.adminSecret.secret) {
        console.log(JSON.stringify(req.body.blog));
        var blog = new BlogModel(req.body.blog);
        blog.save(function (err) {
            if (err)
                res.render('common-error', {error: 'Something went wrong'});
            else
                res.json('success');
        })
    } else {
        res.render('common-error', {error: 'you are not authorized to perform this action'});
    }
});

app.get('/api/admin/blog/fetch', function (req, res) {
    BlogModel.find().sort('-created').exec(function (err, blogs) {
        if (err){
            res.render('common-error', {error: 'Something went wrong'});
        } else {
            res.json(blogs);
        }
    });
});

app.get('/terms-of-use', function(req, res) {
	res.render('termsOfUse');
});

app.get('/privacy-policy', function(req, res) {
    res.render('privacyPolicy');
});

/* Temporary - TO BE REMOVED */

app.get('/profile-view-temp', function(req, res) {
	res.render('profile-view');
});

app.get('/profile-authentication-temp', function(req, res) {
	res.render('profile-authentication');
});

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});
