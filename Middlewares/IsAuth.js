import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class CheckAuth {
    static verifyAuth(req, res, next){
        const authHeader = req.get('Authorization') || req.headers['x-access-token'] || req.headers['Authorization'];

        if (!authHeader) {
            const error = new Error('Not Authorized');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken; 

        try {
            decodedToken = jwt.verify(token, process.env.SECRET);
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }
        if (!decodedToken) {
            const error = new Error('Not Authenticated');
            error.statusCode = 401;
            throw error;
        }
    
        req.userId = decodedToken.userId;
        req.role = decodedToken.role

        next();
    }

}

export default CheckAuth;