module.exports = {
	mailgun: {
    	auth: {
    		api_key: process.env.MAILGUN_API_KEY || 'key-e6a1e08ff51928e50ab79a7d3559beb9',
      	domain : process.env.MAILGUN_DOMAIN_NAME || 'sandbox7647637de8a34c768c69519aab6520ca.mailgun.org'
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