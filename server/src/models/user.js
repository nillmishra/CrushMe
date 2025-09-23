const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!['Male', 'Female', 'Other'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type: String,  
        default : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid");
            }
        }
    },
    about:{
        type: String,
        default: "Hey there! I am using this app."
    },
    skills:{
        type: [String],
    },
    interestedIn:{
        type: String,
        required: true,
        validate(value){
            if(!['Male', 'Female','Other', 'All'].includes(value)){
                throw new Error("InterestedIn data is not valid");
            }
        }
    },
},{
    timestamps: true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ userId: user._id }, "Nill@crushme09", { expiresIn: '1d' });
    return token;
};

userSchema.methods.validatePassword = async function(x){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(x, passwordHash);
    return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;