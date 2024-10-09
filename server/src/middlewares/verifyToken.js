import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ code: 403, message: 'Token is not valid!' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ code: 401, message: 'You are not authenticated!' });
    }
};
