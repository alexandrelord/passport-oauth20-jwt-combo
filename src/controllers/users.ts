import { Request, Response } from 'express';
import { issueJWT, decodeJWT, StatusError } from '../services/services';
import { IUser } from '../models/user';

export const loginOrRegister = async (req: Request, res: Response) => {
    const { _id } = req.user as IUser;

    try {
        const { refreshToken, accessToken } = issueJWT(_id);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true });

        return res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof StatusError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { jwt } = req.cookies;

    try {
        const accessToken = await decodeJWT(jwt);

        return res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof StatusError) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};
