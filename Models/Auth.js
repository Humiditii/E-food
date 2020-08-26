import {Schema, model} from 'mongoose';

const authSchema = new Schema({
    firstname:{
        type: String,
        required: true,
        minlength: [3, 'Firstname should be 3 characters at least'],
        trim:true
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3,'Lastname should be 3 characters at least'],
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true
    },
    role: {
        type: String,
        default: 'User'
    },

    address: {
        street:{
            required: true,
            type: String
        },
        state: {
            required: true,
            type: String
        },
        localgvt:{
            type: String,
            required: true
        }

    },

    password: {
        type: String,
        minlength: [5, 'Password can\'t be less than five characters']

    },
    
    passwordReset: {
        token: {
            type: String,
            default: null
        },
        expiryDte: {
            type: Date,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }



})


export default model('auth', authSchema);