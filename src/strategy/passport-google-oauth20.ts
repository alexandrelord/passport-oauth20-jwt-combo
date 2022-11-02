import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/config';
import User, { IUser } from '../models/user';

const opts = {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: '/users/google/callback',
};

const googleStrategy = new GoogleStrategy(opts, async (accessToken, refreshToken, profile, done) => {
    User.findOne({ email: profile.emails?.[0].value }, async (err: mongoose.CallbackError, user: IUser) => {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            if (!profile.emails?.[0].value) {
                return done(null, false);
            }
            const newUser = await new User({
                email: profile.emails?.[0].value,
            }).save();
            return done(null, newUser);
        }
        return done(null, user);
    });
});

export default passport.use(googleStrategy);
