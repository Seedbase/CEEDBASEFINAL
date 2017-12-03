module.exports = {
	mailgun: {
    	auth: {
    		api_key: process.env.MAILGUN_API_KEY || 'key-a7bb4b66eb277c02a66b91a2e09fad14',
      	domain : process.env.MAILGUN_DOMAIN_NAME || 'ceedbase.com'
    	}
  	},
  	uploads: {
  		profiletVideoUpload: {
  			dest: './public/client-side/profile/videos/uploads'
  		},
      clienJobDescUpload: {
        dest: './public/client-side/client-job/files/uploads'
      },
        blogUpload: {
            dest: './public/images/admin/blog/uploads'
        }
  	},
    adminSecret: {
        secret: 'thisisadminsecret'
    }

}
