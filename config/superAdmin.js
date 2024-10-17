const employee_model = require("../models/employee.model")
const mongoose = require("mongoose");


async function superAdmins() {
    try {

        // Check connection state before proceeding
        if (mongoose.connection.readyState !== 1) {
            console.error("Mongoose not connected. Please wait...");
            return;
        }
        const email = "monaem@gmail.com";
        const password = "9999999aA";
        const role = "admin";
        const Gmail_Acc = "manemosama@gmail.com"
        let existinUser = await employee_model.findOne({ email })
        if (existinUser) {
            return console.log({ message: "superAdmin is already existing" });
        }
        
        await employee_model.create({ email, password, role, Gmail_Acc })
        console.log({ message: "superAdmin is created" });

    } catch (error) {
        console.error('Error during creating superAdmin:', error.message);
    }
}

module.exports = superAdmins;