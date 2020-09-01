import Utils from '../Utils/Utility';
import Auth from '../Models/Auth';

/**
 * Authentication Controller
 * An engine for processing authentication and authorization logics
 */

class AuthController {

    /**
     * This method helps to signup new users
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next
     * @returns {Object} 
     */
    static async signup(req, res, next){
        const { firstname, lastname, email,role,street,state,localgovt, password } = req.body;

        const findMail = await Auth.findOne({email:email})

        try {
            if (findMail){
                return Utils.api_response(res,400,'Email matched with an existing account!!!');
            }else{
                const newUser = new Auth({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    role: role,
                    address : {
                        street: street,
                        state: state,
                        localgvt: localgovt
                    },
                    password: Utils.hashPassword(password)
                })

                newUser.save().then( saved => {
                    const user = saved.firstname;
                    const msg = `${user} signed up successfully`;
                    return Utils.api_response(res,201,msg);
                }).catch( err => {
                    return Utils.appError(err, next)
                })
            }
        } catch (error) {
            return Utils.appError(error, next);
        }

    }

    /**
     * This method helps to signin users
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next
     * @returns {Object} 
     */
    static async signin(req, res,next){
        const {email, password} = req.body;

        const findUser = await Auth.findOne({email: email});

        try {
            if (!findUser){
                return Utils.api_response(res, 404, 'User not found, check authentication credentials!!!')
            }else{
                const dbPassword = findUser.password;

                const comparePassword = Utils.decodePwd(password,dbPassword);

                if(comparePassword){
                    const user_data = {
                        email: findUser.email,
                        id: findUser._id,
                        role: findUser.role
                    }
                    const token = Utils.generateToken(user_data)
            
                    const msg = `${findUser.firstname} logged in`;

                    return Utils.api_response(res, 200, msg, token);
                }else{
                    return Utils.api_response(res, 401, 'Incorrect Password');
                }
            }
        } catch (err) {
            return Utils.appError(err, next);
        }
    }

    /**
     * This method provide change password function for authorized user
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next
     * @returns {Object} 
     */
    static async changePassword(req, res, next){

        const {role, userId} = req;

        const { prePassword, password } = req.body;

        const user = await Auth.findById(userId)

        try {
            if( Utils.decodePwd(prePassword, user.password) ){

                user.password = Utils.hashPassword(password);

                user.save().then( changed => {
                    return Utils.api_response(res, 200, 'Password Changed')
                }).catch( err => {
                    return Utils.appError(err, next)
                })

            }else{
                return Utils.api_response(res, 400, 'Incorrect Old password')
            }
        } catch (err) {
            return Utils.appError(err, next)
        }

    }

    /**
     * This method helps to send password resent link to the user with a specific mail
     * @param {Object} req 
     * @param {Object} res 
     * @param {Object} next
     * @returns {Object} 
     */

    static async sendResetToken(req, res, next){
        const {email} = req.body;

        const findUser = await Auth.findOne({email:email})

        try {
            if(!findUser){
                return Utils.api_response(res, 404, 'Email doesn\'t match any account!!! ')
            }else{
                const resetToken = Utils.randomStr();
                const expiryDate = Date.now() + (60 * 1000 * 60);

                findUser.passwordReset.token = resetToken;
                findUser.passwordReset.token = expiryDate;

                findUser.save().catch( savedTokenDetails => {
                    Utils.mailer().sendMail({
                        to: savedTokenDetails.email,
                        from: 'E-Food',
                        subject: 'Password Reset token',
                        html: ` <div>
                                        <p> Hello 
                                        <b>${savedTokenDetails.firstname}
                                        </b>, we sympathize with you for forgetting your password, however to be able to change it, you will require a token which is below
                                         </p>
                                         <div>
                                            <p>Your Token is <b>${savedTokenDetails.passwordReset.token}</b>  validity period is for 1-hour(60min)</p>
                                         </div>
                                </div>`
                    }).then( sent => {
                        const msg = `Token sent to ${savedTokenDetails.email}`
                        return Utils.api_response(res, 200,msg);
                    }).catch( err => {
                        return Utils.appError(err, next)
                    })
                }).catch( err => {
                    return Utils.appError(err, next);
                })
            }
        } catch (error) {
            return Utils.appError(error, next);
        }
    }

    static async resetPassword (req, res, next){
        const {email, token, new_password} = req.body;
        try {
            const findUser = await Auth.findOne({email: email})
            if (findUser.passwordReset.token == token){
                if(Date.now() >= findUser.passwordReset.expiryDate ){
                    return Utils.api_response(res,400,'Token Expired');
                }else{
                    findUser.password =  Utils.hashPassword(new_password)

                    findUser.save().then( updatedUser => {
                        return Utils.api_response(res, 200, 'Password reset was successful, please proceed to login');
                    }).catch( err => {
                        return Utils.appError(err, next);
                    })
                }
            }else{
                return Utils.api_response(res, 404, 'Invalid token supplied');
            }
        } catch (error) {
            return Utils.appError(error, next);
        }
    }

    static updateProfile(req, res, next){

    }

    static forgetPassword(req, res, next){

    }
} 




export default AuthController;