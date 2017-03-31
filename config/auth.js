module.exports={
     'facebookAuth' : {
        'clientID'      : '1765593103756725', // your App ID
        'clientSecret'  : '9c9da556e7724245dc163e5f6a90767a', // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback',
        'profileFields': ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },

    'twitterAuth' : {
        'consumerKey'       : 'APyoRQ2rlnH66AR3gvhft8vvG',
        'consumerSecret'    : '20lsvFpybCSHKDjkY5NsNaYKTeKu7s57Z5wkiDZeHCvTCVD4tj',
        'callbackURL'       : 'http://localhost:8000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    }

}