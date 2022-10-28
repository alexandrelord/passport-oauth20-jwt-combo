import express from 'express';
import passportGoogle from '../strategy/passport-google-oauth20';
import passportJWT from '../strategy/passport-jwt';
import { loginRegister, refresh } from '../controllers/users';

const router = express.Router();

router.get('/google', passportGoogle.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passportGoogle.authenticate('google', { session: false }), loginRegister);
router.post('/refresh', refresh);
router.get('/protected', passportJWT.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        msg: 'You are authorized',
    });
});

export default router;
