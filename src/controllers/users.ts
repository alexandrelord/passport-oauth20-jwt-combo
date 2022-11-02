import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/user';
import { issueJWT } from '../utils/utils';

export const loginRegister = async (req: Request, res: Response) => {
    try {
        console.log(req.user);
        const user = req.user;
        const { accessToken, refreshToken } = issueJWT(user);
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });
        return res.status(200).json({ accessToken });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    if (req.cookies.jwt) {
        const { refreshToken } = req.cookies;

        jsonwebtoken.verify(refreshToken, config.jwt.refreshTokenSecret, (err: any, payload: any) => {
            if (err) {
                return res.sendStatus(403);
            }

            const user = User.findById(payload.sub);

            if (!user) {
                return res.sendStatus(403);
            }

            const { accessToken } = issueJWT(user);

            return res.json({ accessToken });
        });
    }
};
