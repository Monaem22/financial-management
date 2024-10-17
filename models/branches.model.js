const mongoose = require("mongoose");

const branches_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    supervisor_name: String,
    address: String,
    phone: String,
    mobile_Number: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course_table",
    }],

},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

const branches_DB = mongoose.model("branches_table", branches_Schema)
module.exports = branches_DB;
