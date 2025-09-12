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
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: `{VALUE} is not supported`
        }
        // validate(value){
        //     if(!['Male', 'Female', 'Other'].includes(value)){
        //         throw new Error("Gendder data is not valid");
        //     }
        // }
    },
    photoUrl:{
        type: String,  
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser_149071&psig=AOvVaw2xNGU5dFryweKEx3WfJqpJ&ust=1757590546538000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPC_tZaNzo8DFQAAAAAdAAAAABBY",
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
    }
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