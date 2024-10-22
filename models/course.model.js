const mongoose = require("mongoose");

const course_Schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true ,
    },
    cost: {
        type: Number,
        trim: true,
        required: true,
    },
    description: String,
    Number_of_hours: String,

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "students_table",
    }],
    branches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches_table",
    }],


},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

const course_DB = mongoose.model("course_table", course_Schema)
module.exports = course_DB;
