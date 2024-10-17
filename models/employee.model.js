const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    Gmail_Acc: {
        type: String,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        default: '/employee/defualt.jpg',
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
    },
    Total_paid:{
        type: Number,
        default: 0
    },    
    Total_expenses:{
        type: Number,
        default: 0
    }, 
    times_of_payments:{
        type: Number,
        default: 0
    },
    times_of_expenses:{
        type: Number,
        default: 0
    },
    branch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches_table",
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    mobile_number: String,
    active: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    // tokens: [{
    //     type: String,
    //     trim: true,
    //     Expires: {
    //         type: Date,
    //         default: Date.now,
    //         expires: "7h"
    //     },
    // }]
    
},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

userSchema.index({ email: 1 }, { unique: true });


userSchema.pre('save', async function (next) {
    const isModified = this.isModified('password');
    if (!isModified) return next();  //Don't re-hash if not modified + it will save empty or default value

    // const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/;
    // if (!strongPasswordRegex.test(this.password)) {
    //     return next(new Error('Password must be at least 8 characters long and include a mix of uppercase, lowercase, and numbers.'));
    // }
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
},
);


const employeeDB = mongoose.model("employees_table", userSchema)
module.exports = employeeDB;

