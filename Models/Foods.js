import {Schema, model} from 'mongoose';

const foodSchema = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },

    price: {
        type: Number,
        min:0,
        required: true
    }, 

    quantity: {
        type: Number,
        required: true,
        min: 0

    },
    image: {
        type: String,
        default: 'food.jpg'
    },
    uploaded: {
        type: Date,
        default: Date.now()
    }
})


export default model('food', foodSchema);