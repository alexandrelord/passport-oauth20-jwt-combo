import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/user';

/**
 * @param {*} _id - The user id
 * @returns {object} - Returns an object with the access token and refresh token
 *
 * This function creates a new access token and refresh token for the user.
 */

export const issueJWT = (_id: string) => {
    const payload = {
        sub: _id,
        iat: Date.now(),
    };

    const accessToken = jsonwebtoken.sign(payload, config.jwt.accessTokenSecret, { expiresIn: '10m' });
    const refreshToken = jsonwebtoken.sign(payload, config.jwt.refreshTokenSecret, { expiresIn: '1d' });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};

// --------------------------------------------------------------------------------

/**
 * @param {*} token - The refresh token
 * @returns {string} accessToken - Returns the access token
 *
 * This function takes the refresh token and returns the access token
 **/

export const decodeJWT = async (token: string) => {
    if (!token) {
        throw new StatusError('Refresh token is required', 400);
    }

    const decoded = jsonwebtoken.verify(token, config.jwt.refreshTokenSecret);

    const user = await User.findById(decoded.sub);
    if (!user) {
        throw new StatusError('User does not exist', 401);
    }

    const { accessToken } = issueJWT(user._id);

    return accessToken;
};

// --------------------------------------------------------------------------------

/**
 *
 * StatusError class
 *
 */

export class StatusError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// --------------------------------------------------------------------------------
