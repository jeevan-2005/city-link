import { Schema , model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be at least 5 charcter'],
        maxLength: [50, 'Name should be less than 50 char'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true , 'user email is required'],
        unique: true,
        lowercase: true,
        unique: [true , 'already registered']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 char'],
        select: false
    },
    role:{
        type: 'String',
        enum: ['USER', 'ADMIN' , 'SUPERADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: {
        type: String,
    },
    
    forgotPasswordExpiryDate: {
        type: Date
    },
    subscription: {
        id: String,
        status: String
    }
    // password: {
    //     type: 'String'
    // },
},{
    timestamps: true
});
const User = model('User' , userSchema);

export default User;