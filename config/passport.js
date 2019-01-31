// LDAP authentication with Active Directory
var LdapStrategy = require('passport-ldapauth');
var User                  = require('../app/models/user');

module.exports = function(passport) {
    // Maintaining persistent login sessions
    // serialized  authenticated user to the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // deserialize when subsequent requests are made
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    var ldapOptions = require('./ldap/ldapConfig');

    passport.use(new LdapStrategy( {
        usernameField : 'email',
        passReqToCallback: true,
        server: ldapOptions
        },
        function (req, profile, done) {
           process.nextTick(function () {
               if (!req.user) {
                   User.findOne({ 'user.email' :  profile.sAMAccountName }, function(err, user) {
                       console.log('\nSaving user information...\n');
                       console.log(profile);
                       console.log('\n');
                       if (err){ return done(err);}
                       if (user) {
                           return done(null, user);
                       }
                       else {

                           if (profile.homeDirectory == null) {
                               var home = '';
                           }
                           else {
                               var home = profile.homeDirectory;
                           }

                           var newUser             = new User();
                           newUser.user.username   = profile.sAMAccountName;
                           newUser.user.email      = '';
                           newUser.user.name       = profile.displayName;
                           newUser.user.address    = '';
                           newUser.user.uidNum     = profile.uidNumber;
                           newUser.user.gidNum     = profile.gidNumber;
                           newUser.user.homeDir    = home;
                           newUser.user.pod  = '';
                           newUser.save(function(err) {
                               if (err)
                               throw err;
                               return done(null, newUser);
                           });
                       }
                   });
               }
               else {
                    User.findOne({ 'user.email' :  profile.sAMAccountName }, function(err, user) {
                        if (err){ return done(err);}
                        if (user) {
                            return done(null, user);
                        }
                        else {
                            return done(null, user);
                        }
                   });
               }
           });
        }
    ));
};
