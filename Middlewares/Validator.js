import Validator from 'validatorjs';
import Utils from '../Utils/Utility';

/**
 * THis Class helps to validate the request bodies before feeding to the main Engine for processing, with Validatorjs package
 */
class ValidateRequests {
    static checkEmpty(req, res, next){
      
      const requestFields = Object.keys(req.body)

      const validationFields = Object();

      for (const iterator of requestFields) {
        validationFields[iterator] = 'required'
      }
      
      const validator = new Validator(req.body, validationFields);

        validator.passes( ()=> next() );

        validator.fails( ()=> {
          const errors = validator.errors.all();
          const valErr = {}
          valErr.message = errors;
          valErr.statusCode = 400;
          return Utils.appError(valErr,next)
        })
    }

    static samePassword(req, res, next){
      const {password, confirmPassword} = req.body;

      if ( password !== confirmPassword ){
        const valErr = Object();
        valErr.message = 'Password does not match';
        valErr.statusCode = 400;

        return Utils.appError(valErr, next)
      }else{
        return next()
      }

    }

    static checkEmail(req, res, next){
      const emailCheck = {email: 'required|email'}

      const validator = new Validator(req.body, emailCheck);

      validator.passes( () => next() );

      validator.fails( () => {
        const errors = validator.errors.all();
        const valErr = {}
        valErr.message = errors;
        valErr.statusCode = 400;
        return Utils.appError(valErr,next)
      });

    }

}


  
export default ValidateRequests;