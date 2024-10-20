const student_model = require("../models/student.model")
const employee_model = require("../models/employee.model")
const branches_model = require("../models/branches.model")
const course_model = require("../models/course.model");



const branches_Controller = {
    get_one_branche: async (req, res) => {
        try {
            const {branche_ID} = req.params;
            const purposed_branche = await branches_model.findById(branche_ID);
            if (!purposed_branche) {
                return res.status(404).send({ message: "لم يتم العثور على الفرع بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            res.status(200).json({ status: "success", data: purposed_branche });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    get_all_branches: async (req, res) => {
        try {
            const all_branches = await branches_model.find().populate("courses" , "name");
            if (all_branches.length === 0) {
                return res.status(404).send({ message: " لم يتم العثور على اي فروع" });
            }
            const all_branches_count = await branches_model.countDocuments();
            res.status(202).send({  
                number_of_branches : all_branches_count ,all_branches : all_branches
            });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    add_branche: async (req, res) => {
        try {
            const existing_branche = await branches_model.findOne({ name: req.body.name} );
            if (existing_branche) {
                return res.status(403).send({
                    error: "الفرع موجود بالفعل"
                });
            }

            const new_branche = await branches_model.create(req.body);
            res.status(200).json({ status: "is created successfully", data: new_branche });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    delete_branche: async (req, res) => {
        try {
            const {branche_ID} = req.params;
            const purposed_branche = await branches_model.findById(branche_ID);
            if (!purposed_branche) {
                return res.status(404).send({ message: "لم يتم العثور على الفرع بهذا المعرف أو تم حذفه من قبل" });
            }
            await branches_model.findByIdAndDelete(branche_ID);

            res.status(200).json({ status: "تم حذف الفرع بنجاح", بياناته: purposed_branche });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    update_branche : async (req , res) => {
        try {
            const {branche_ID} = req.params;
            const purposed_branche = await branches_model.findById(branche_ID);
            if (!purposed_branche) {
                return res.status(404).send({ message: "لم يتم العثور على الفرع بهذا المعرف أو تم حذفه من قبل" });
            }
            const updated_branche = await branches_model.findByIdAndUpdate(branche_ID, {...req.body}, { new: true });
            res.status(200).json({ status: "تم التعديل بنجاح", data: updated_branche });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    
    add_course_to_branche : async (req , res) => {
        try {
            const { branch_ID } = req.params;
            const { course_ID } = req.body;
            const purposed_branch = await branches_model.findById(branch_ID);
            if (!purposed_branch) {
                return res.status(404).send({
                    error: "لم يتم العثور على الفرع بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }
            if (purposed_branch.courses.includes(course_ID)) {
                return res.status(403).send({
                    error: "الكورس مضاف بالفعل"
                });
            }

            const purposed_course = await course_model.findById(course_ID);
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            } 

            purposed_branch.courses.push(course_ID);
            await purposed_branch.save();
            purposed_course.branches.push(branch_ID);
            await purposed_course.save();

            res.status(200).json({ status : "تم الاضافه بنجاح" , data : purposed_branch });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        } 
    } ,
    delete_course_from_branch : async (req , res) => {
        try {
            const { branch_ID } = req.params;
            const { course_ID } = req.body;
            const purposed_branch = await branches_model.findById(branch_ID);
            if (!purposed_branch) {
                return res.status(404).send({
                    error: "لم يتم العثور على الفرع بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }

            if (!purposed_branch.courses.includes(course_ID)) {
                return res.status(403).send({
                    error:   " الكورس غير مضاف بالفعل او تم حذفه من قبل"
                });
            } 
            const purposed_course = await course_model.findById(course_ID);
            if (!purposed_course) { 
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            } 

            purposed_branch.courses.pull(course_ID);
            await purposed_branch.save();
            purposed_course.branches.pull(branch_ID);
            await purposed_branch.save();

            res.status(200).json({ status : "تم الحذف بنجاح" , data : purposed_branch });

        } catch (error) { 
            res.status(500).json({ status: "failed", message: error.message });
        } 
    },  

    show_branch_courses : async (req , res) => {
        try {
            const { branch_ID } = req.params;
            const purposed_branch = await course_model.find({branches : branch_ID}).populate("branches");
            if (purposed_branch.length === 0) {
                return res.status(404).send({
                    error: " لا يوجد اي كورسات لهذا الفرع "
                });
            }
            const all_courses_count = await course_model.countDocuments({ branches : branch_ID });

            res.status(200).json({ status : "تم العرض بنجاح" ,
                number_of_courses : all_courses_count ,
                 data : purposed_branch });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    show_branch_employees : async (req , res) => {
        try {
            const { branch_ID } = req.params;
            const purposed_employee = await employee_model.find({branch :branch_ID}).populate("branch");
            if (purposed_employee.length === 0) {
                return res.status(404).send({
                    error: " لا يوجد اي موظفين لهذا الفرع "
                });
            }
            const all_employees_count = await employee_model.countDocuments({branch :branch_ID});

            res.status(200).json({ status : "تم العرض بنجاح" ,
                "number_of_employees" : all_employees_count ,
                data : purposed_employee });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },



}

module.exports = branches_Controller ;