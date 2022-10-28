import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from '../config/config';
import passport from 'passport';
import User from '../models/User';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.accessTokenSecret,
};

const jwtStrategy = new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.sub }, async (err: any, user: any) => {
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
