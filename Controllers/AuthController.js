import Utils from '../Utils/Utility';
import Auth from '../Models/Auth';

/**
 * Authentication Controller
 */

class AuthController {
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
                        id: findUser._id
                    }
                    const token = Utils.generateToken(user_data)
            
                    const msg = `${findUser.firstname} logged in`;

                    return Utils.api_response(res, 200, msg, token);
                }else{
                    return Utils.api_response(res, 401, 'Incorrect Password');
                }
            }
        } catch (err) {
            return Utils.appError(err, next)
        }
    }

    static changePassword(req, res, next){

    }

    static sendResetLink(req, res, next){

    }

    static updateProfile(req, res, next){

    }

    static forgetPassword(req, res, next){

    }
} 




export default AuthController;