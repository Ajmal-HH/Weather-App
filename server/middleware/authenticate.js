import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log('Authorization header is missing');
        return res.sendStatus(401); // Unauthorized
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('Token is missing');
        return res.sendStatus(401); // Unauthorized
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403); // Forbidden
        }
        
        req.user = user;
        console.log('User authenticated');
        next();
    });
};

export default authenticate;
