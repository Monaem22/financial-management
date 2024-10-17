const { date } = require("joi");
const mongoose = require("mongoose");

const student_Schema = new mongoose.Schema({
    recent_Payment:{
        type: Number,
        default: 0
    }, 
    recent_expenses:{
        type: Number,
        default: 0
    },
    Remaining_payment:{
        type: Number,
        default: 0
    },   
    balance:{
        type: Number,
        default: 0
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
    expenses_name : String,
    expenses: Number, //i will add
    
    Name: {
        type: String,
        // required: true,
    },
    national_ID: {
        type: Number,
        trim: true,
        // required: true,
    },
    Year_of_qualification: {
        type: String,
        default: "0000-00-00",
    },
    Gender: {
        type: String,
        enum: ['ذكر', 'انثي'],
    },
    student_birthDate: {
        type: String,
        default: "0000-00-00",
    },
    Submission_date: {
        type: String,
        default: "0000-00-00",
    },
    engleish_student_Name: String,
    Religion: String,
    qualification: String,
    phone: String,
    address: String,
    notes: String,
    mobile_Number_1: String,
    mobile_Number_2: String,
    Academic_year:  {
        type: String,
        default: new Date().getFullYear(),
    },
    image: {
        type: String,
        trim: true,
        default: '/employee/defualt.jpg',
    },    
    qualification_certificate: {
        type: String,
        trim: true,
    },    
    personal_ID_card: {
        type: String,
        trim: true,
    },
    branch : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches_table",
    },
    
},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

student_Schema.index({ national_ID: 1 }, { unique: true });

const studentDB = mongoose.model("students_table", student_Schema)
module.exports = studentDB;

