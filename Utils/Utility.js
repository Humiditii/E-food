import { hashSync , compareSync} from 'bcryptjs';
import {sign} from 'jsonwebtoken'
import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';
import {randomBytes} from 'crypto';


dotenv.config()

/**
 * Utility Class
 * contains helpers methods for code reusability
 */

class Utility {

    /**
     * hashPassword, receives a string of password and hash it using the bcryptjs lib
     * 
     * @param {String} password
     * @return {String} 
     */
    static  hashPassword(password){
        const hashedPwd =  hashSync(password, 10);
        return hashedPwd; 
    }

    /**
     * decodePwd receives a password string from the request body and a retrived hashed password 
     * from the database
     * Returns a boolean, True if both password match, false if not
     * 
     * @param {String} reqPassword 
     * @param {String} dbPassword 
     * @return {Boolean} 
     */
    static decodePwd(reqPassword, dbPassword){
        const compare = compareSync(reqPassword, dbPassword);
        return compare;
    }

    /**
     * appError helps to pass application errors to the error handler 
     * 
     * @param {Object} err 
     * @param {Object} next 
     * 
     */
    static appError (err, next){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


    /**
     * generateToken method receives user details in Object, process ir
     * Returns the token
     * @param {Object} user_token_data 
     */
    static generateToken(user_token_data){
        return sign({
            email:user_token_data.email,
            userId: user_token_data.id,
            role: user_token_data.role
        }, process.env.SECRET,  { expiresIn: '5d' })
    }

    /**
     * Mailer method helps to create the mailing pipeline
     */
    static mailer(){
        const transporter = createTransport(sendGridTransport({
            auth: {
                api_key: process.env.SEND_GRID_API
            }
        }));

        return transporter;

    }
    /**
     * THis generates random strings
     * @return {string} 
     */
    static randomStr(){
        return randomBytes(5).toString('hex');
    }

    /**
     * This helps to return the http response to the client
     * @param {Object} responseObject 
     * @param {Number} statusCode 
     * @param {String} response_msg 
     * @param {Object} responseData 
     * @return {Object}
     */
    static api_response(responseObject, statusCode, response_msg, responseData=null ){
        return responseObject.status(statusCode).json({
            message: response_msg,
            data: responseData
        });
    }

}


export default Utility;
