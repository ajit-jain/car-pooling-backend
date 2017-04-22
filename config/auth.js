module.exports={
     'facebookAuth' : {
        'clientID'      : process.env.FB_CLIENT_ID, // your App ID
        'clientSecret'  : process.env.FB_CLIENT_SECRET, // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback',
        'profileFields': ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TW_CONSUMER_KEY,
        'consumerSecret'    : process.env.TW_SECRET,
        'callbackURL'       : 'http://localhost:8000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    },
    

}