const mongoose = require("mongoose");


const date = new Date();
const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

const sysActions_Schema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students_table",
    },    
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees_table",
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches_table",
    },
    papers_withdrawal : {
        type: Boolean,
    },
    payment: {
        type: Number,
    },
    expenses: {
        type: Number,
    },
    action: {
        type: String,
    },
    date: {
        type: String,
        default: formattedDate
    },
},
{ timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)
const studentDB = mongoose.model("sysActions_table", sysActions_Schema)
module.exports = studentDB;
