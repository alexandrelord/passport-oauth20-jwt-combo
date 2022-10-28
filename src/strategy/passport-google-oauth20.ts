import User from '../models/User';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/config';

const opts = {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: '/users/google/callback',
};

const googleStrategy = new GoogleStrategy(opts, async (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile.emails?.[0].value }, async (err: Error, user: Express.User) => {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            const newUser = new User({
                email: profile.emails?.[0].value,
            });
            await newUser.save();
            done(null, newUser);
        }
        done(null, user);
    });
});

export default passport.use(googleStrategy);
