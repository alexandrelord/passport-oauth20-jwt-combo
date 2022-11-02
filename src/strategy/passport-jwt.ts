import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config/config';
import User, { IUser } from '../models/user';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.accessTokenSecret,
};

const jwtStrategy = new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.sub }, async (err: mongoose.CallbackError, user: IUser) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    });
});

export default passport.use(jwtStrategy);
