const student_model = require("../models/student.model") ;
const sysAction_Model = require("../models/system-actions.model")
const course_model = require("../models/course.model");
const sendEmail = require("../services/sendEmail");

const course_Controller = {
    add_course: async (req, res) => {
        try { 
            const existing_course = await course_model.findOne({ name: req.body.name} );
            if (existing_course) {
                return res.status(403).send({
                    error: "الكورس موجود بالفعل"
                });
            }

            const new_course = await course_model.create(req.body);

            res.status(200).json({ status: "is created successfully", data: new_course });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    get_one_course: async (req, res) => {
        try {
            const { course_ID } = req.params;
            const purposed_course = await course_model.findById(course_ID)
                .populate("students");
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }

            res.status(200).json({ status: "success", 
                "عدد الطلاب بهذا الكورس" : purposed_course.students.length, 
                data: purposed_course  
            });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    }, 
    get_all_courses: async (req, res) => {
        try {
            const all_courses = await course_model.find();
            if (all_courses.length === 0) {
                return res.status(404).send({ message: " لم يتم العثور على اي كورسات " });
            }

            const all_courses_count = await course_model.countDocuments();
            res.status(202).send({  
                number_of_courses : all_courses_count ,all_courses : all_courses
            });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    update_course: async (req, res) => {
        try {
            const { course_ID } = req.params;
            const purposed_course = await course_model.findById(course_ID);
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }

            const updated_course = await course_model.findByIdAndUpdate(
                course_ID , {...req.body}, { new: true }
            );
            res.status(200).json({ status: "تم التعديل بنجاح", data: updated_course });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    delete_course: async (req, res) => {
        try {
            const { course_ID } = req.params;
            const purposed_course = await course_model.findByIdAndDelete(course_ID);
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }
            res.status(200).json({ status: "تم الحذف بنجاح" });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },

    add_student_to_course : async (req , res ,next) => {
        try {
            const { course_ID } = req.params;
            const { student_name , student_national_ID } = req.body;
            const purposed_course = await course_model.findOne({_id : course_ID });
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }

            const purposed_student = await student_model.findOne({
                Name : student_name , national_ID : student_national_ID
            });
            if (!purposed_student) {
                return res.status(404).send({
                    error: "لم يتم العثور على الطالب بهذا الاسم والرقم القومي " });
            } 

            if (purposed_course.students.includes(purposed_student._id)) {
                return res.status(404).send({
                    error: "تم الاضافه بالفعل لذلك الطالب في هذا الكورس من قبل" 
                });
            }
            req.body.withdrawal = false ;
            req.params.student_ID = purposed_student._id ;
            req.body.expenses = purposed_course.cost;
            req.body.expenses_name = purposed_course.name;
            req.body.cost_string = "تم اضافة الكورس للطالب واضافة المصاريف بنجاح"

            purposed_course.students.push(purposed_student._id);
            await purposed_course.save();

            next();

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    } ,
    // سحب الورق 
    delete_student_from_course : async (req , res ,next) => {
        try {
            const { course_ID } = req.params;
            const { student_name , student_national_ID } = req.body;
            const purposed_course = await course_model.findById(course_ID);
            if (!purposed_course) {
                return res.status(404).send({
                    error: "لم يتم العثور على الكورس بهذا المعرف .. الرجاء إدخال المعرف الصحيح"
                });
            }
            const purposed_student = await student_model.findOne({
                Name : student_name , national_ID : student_national_ID
            });
            if (!purposed_student) {
                return res.status(404).send({
                    error: "لم يتم العثور على الطالب بهذا الاسم والرقم القومي " });
            } 
            if (!purposed_course.students.includes(purposed_student._id)) {
                return res.status(404).send({ 
                    error: " لم يتم العثور على الطالب بهذا الاسم والرقم القومي او تم سحب اوراقه من قبل" });
            }
            req.params.student_ID = purposed_student._id ;
            req.body.payment = purposed_course.cost; // الفلوس اللي الطالب هيسترجعها

            purposed_course.students.pull(purposed_student._id);
            await purposed_course.save();

            const message =  `
            تم سحب اوراق الطالب : ${purposed_student.Name} ,
            صاحب الرقم القومي : ${purposed_student.national_ID} ,
            بواسطة الموظف : ${req.user.email} ,
            وتم استرجاع اموال الطالب : ${purposed_course.cost} ,
            `
            await sysAction_Model.create({
                student : purposed_student._id ,
                employee : req.user._id,
                branch : req.user.branch ,
                papers_withdrawal : true ,
                payment : purposed_course.cost ,
                action : message
            });
            req.user.flag = true ;
            req.userwithdrawals_string = "تم سحب اوراق الطالب واسترجاع فلوسه" ;

            await sendEmail({
                email: "manemosama@gmail.com",
                subject: ` تم سحب اوراق الطالب : ${purposed_student.Name} `,
                text: message,
            });
            next();

            // purposed_student.Remaining_payment -=parseInt(purposed_course.cost) ;
            // purposed_student.save();

            // res.status(200).json({ status : "تم الحذف بنجاح" , data : purposed_course });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },

    show_student_courses : async (req , res) => {
        try {
            const { student_ID } = req.params;
            const student_courses = await course_model.find({ students : student_ID });
            if (student_courses.length === 0) {
                return res.status(404).send({
                    error: "لم يتم العثور على اي كورسات لهذا الطالب "
                });
            }
            
            res.status(200).json({ status : "تم العرض بنجاح" , student_courses : student_courses });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    search_On_course_by_name: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({ message: "enter the Name you want to search" })
            }
            const search_On_course = await course_model.find({
                name: { $regex: search, $options: "i" }
            })
            if (search_On_course.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no courses found with this name "
                })
            }
            res.status(200).send(search_On_course);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },


}

module.exports = course_Controller ;
