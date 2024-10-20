const student_model = require("../models/student.model")
const sysAction_Model = require("../models/system-actions.model")
const employee_model = require("../models/employee.model")
const course_model = require("../models/course.model");
const fs = require("fs");
const bcrypt = require("bcrypt");
const remove_file = require("../Services/remove_file_when_update.service");

const employee_Controller = {
    //student 
    add_student: async (req, res) => {
        try {
            const { national_ID } = req.body;

            const existingUser = await student_model.findOne({ national_ID: national_ID });
            if (existingUser) {
                return res.status(403).send({
                    error: "الطالب موجود بالفعل"
                });
            }
            const new_student = await student_model.create({branch : req.user.branch , ...req.body });
            res.status(200).json({ status: "is created successfully", data: new_student });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    get_Student: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            res.status(200).json({ status: "success", data: purposed_student });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    get_All_Students_for_All_Branches: async (req, res) => {
        try {
            const { Academic_year } = req.body;
            if (!Academic_year) {
                var all_students = await student_model.find().select("Name national_ID Academic_year");
                if (all_students.length === 0) { 
                    return res.status(404).send(" لا يوجد طلاب للفروع")
                }
                var students_count = await student_model.countDocuments({});
            }else{
                var all_students = await student_model.find({Academic_year: Academic_year})
                    .select("Name national_ID Academic_year");
                if (all_students.length === 0) {
                    return res.status(404).send(" لا يوجد طلاب بهذا العام")
                }
                var students_count = await student_model.countDocuments({Academic_year: Academic_year});
            }
            return res.status(200).send({
                number_of_students : students_count,
                all_students_for_all_brances : all_students
            });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    get_All_students_with_Custom_Academic_year: async (req, res) => {
        try {
            const { branch , Academic_year } = req.body;
            if (!Academic_year) {
                var all_students = await student_model.find({branch :branch})
                    .select("Name national_ID Academic_year");
                if (all_students.length === 0) {
                    return res.status(404).send(" لا يوجد طلاب لهذا الفرع")
                }
                var students_count = await student_model.countDocuments({branch :branch });
                // const countsByCity = await student_model.aggregate([
                //     { $group: { _id: '$Academic_year', count: { $count: {} } } }
                // ]);
            }else{
                var all_students = await student_model.find({branch : branch ,Academic_year: Academic_year})
                    .select("Name national_ID Academic_year");
                if (all_students.length === 0) {
                    return res.status(404).send("no students founded ")
                }
                var students_count = await student_model.countDocuments({branch : branch ,Academic_year: Academic_year});
            }
            return res.status(200).send({
                number_of_students : students_count,
                students_data : all_students
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    delete_Student: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف أو تم حذفه من قبل" });
            }
            if (purposed_student.image !== "/employee/defualt.jpg") {
                remove_file.remove_previous_img(purposed_student)
            }
            if (purposed_student.qualification_certificate) {
                remove_file.remove_previous_qualification_certificate(purposed_student)
            }
            if (purposed_student.personal_ID_card) {
                remove_file.remove_previous_personal_ID_card(purposed_student)
            }

            await student_model.findByIdAndDelete(student_ID);
            res.status(200).json({ status: "تم حذف الطالب بنجاح", بياناته: purposed_student });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    update_Student: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const new_national_ID = req.body.national_ID;
            const existingUser = await student_model.findOne({ national_ID: new_national_ID });
            if (existingUser) {
                return res.status(403).send({
                    error: "الطالب موجود بالفعل يرجي ادخال رقم قومي اخر"
                });
            }
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            const updated_student = await student_model.findByIdAndUpdate(student_ID, {...req.body}, { new: true });
            res.status(200).json({ status: "تم التعديل بنجاح", data: updated_student });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    Update_Image: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                fs.unlinkSync(req.file.path)
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of img (".png",".jpg",".jpeg",".pdf")')
            }
            const new_Image_Path = `${req.baseUrl}/${req.file.filename}`
            if (purposed_student.image !== "/employee/defualt.jpg") {
                remove_file.remove_previous_img(purposed_student)
            }
            await student_model.findByIdAndUpdate(
                student_ID, { image: new_Image_Path }, { new: true }
            )
            res.status(201).send({ message: "image is saved", new_Image_Path })

        } catch (error) {
            fs.unlinkSync(req.file.path)
            res.status(500).send({ message: error.message });
        }
    },
    upload_Qualification_certificate : async (req, res) => {
        try {
            const {student_ID} = req.params;
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                fs.unlinkSync(req.file.path)
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of img (".png",".jpg",".jpeg",".pdf")')
            }
            const new_file_Path = `${req.baseUrl}/${req.file.filename}`
            if (purposed_student.qualification_certificate) {
                remove_file.remove_previous_qualification_certificate(purposed_student)
            }
            await student_model.findByIdAndUpdate(
                student_ID, { qualification_certificate: new_file_Path }, { new: true }
            ) 
            res.status(201).send({ message: "qualification_certificate is saved", new_file_Path }) 

        } catch (error) {
            fs.unlinkSync(req.file.path)
            res.status(500).send({ message: error.message });
        }
    },
    upload_personal_ID_card : async (req, res) => {
        try {
            const {student_ID} = req.params;
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                fs.unlinkSync(req.file.path)
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of img (".png",".jpg",".jpeg",".pdf")')
            }
            const new_file_Path = `${req.baseUrl}/${req.file.filename}`
            if (purposed_student.personal_ID_card) {
                remove_file.remove_previous_personal_ID_card(purposed_student)
            }
            await student_model.findByIdAndUpdate(
                student_ID, { personal_ID_card: new_file_Path }, { new: true }
            ) 
            res.status(201).send({ message: "personal_ID_card is saved", new_file_Path }) 

        } catch (error) {
            fs.unlinkSync(req.file.path)
            res.status(500).send({ message: error.message });
        } 
    },
    //////////////////
    get_all_employees: async (req, res) => {
        try {
            const all_employees = await employee_model.find({role: "employee"});
            if (all_employees.length === 0) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            const employees_count = await employee_model.countDocuments({role: "employee"});

            res.status(200).json({
                number_of_employees : employees_count,
                all_employees: all_employees 
            });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    add_new_employee: async (req, res) => {
        try {
            const data = req.body;
            const existingUser = await employee_model.findOne({ email: data.email });
            if (existingUser) {
                return res.status(403).send({
                    error: "email is already exists..please enter another email"
                });
            }
            const new_employee = await employee_model.create(req.body);

            res.status(201).send({ message: "تم اضافة موظف جديد بنجاح" ,new_employee })

        } catch (error) {
            res.status(500).send({ message: error.message })
        }

    },
    get_one_employee: async (req, res) => {
        try {
            const {employee_ID} = req.params;
            const purposed_employee = await employee_model.findById(employee_ID);
            if (!purposed_employee) {
                return res.status(404).send({ message: "لم يتم العثور على الموظف بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }
            res.status(200).json({ status: "success", data: purposed_employee });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    delete_employee: async (req, res) => {
        try {
            const {employee_ID} = req.params;
            const purposed_employee = await employee_model.findById(employee_ID);
            if (!purposed_employee) {
                return res.status(404).send({ message: "لم يتم العثور على الموظف بهذا المعرف أو تم حذفه من قبل" });
            }
            await employee_model.findByIdAndDelete(employee_ID);
            res.status(200).json({ status: "تم حذف الموظف بنجاح", بياناته: purposed_employee });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    update_employee : async (req , res) => {
        try {
            const {employee_ID} = req.params;
            const purposed_employee = await employee_model.findById(employee_ID);
            if (!purposed_employee) {
                return res.status(404).send({ message: "لم يتم العثور على الموظف بهذا المعرف أو تم حذفه من قبل" });
            }
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password, 12);
            }
            const updated_employee = await employee_model.findByIdAndUpdate(
                employee_ID,{...req.body}, { new: true });
            
            res.status(200).json({ status: "تم التعديل بنجاح", data: updated_employee });
        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    //////////////////
    add_payment: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const {payment} = req.body;
            payment_int = parseInt(payment)
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }

            if (purposed_student.Remaining_payment > payment_int) {
                purposed_student.Remaining_payment -= payment_int;
            }else if (purposed_student.Remaining_payment === 0) {
                purposed_student.balance += payment_int;
            }else{
                purposed_student.balance = payment_int - purposed_student.Remaining_payment;
                purposed_student.Remaining_payment = 0;
            }
            purposed_student.recent_Payment = payment_int;
            purposed_student.times_of_payments += 1;
            purposed_student.Total_paid += payment_int;
            await purposed_student.save();

            req.user.Total_paid += payment_int;
            req.user.times_of_payments += 1;
            await req.user.save();

            if (!req.user.flag) {
                await sysAction_Model.create({
                    student : student_ID ,
                    employee: req.user._id,
                    branch: req.user.branch ,
                    payment : payment_int ,
                    action: ` ${req.user.email} this user made a payment of ${payment} to 
                        student national_ID : ${purposed_student.national_ID} , 
                    name : ${purposed_student.Name} `,
                });
            }
            res.status(200).json({ 
                status : req.userwithdrawals_string || "تم الدفع بنجاح" ,
                 "الباقي": purposed_student.Remaining_payment ,
                 " رصيد الطالب الان": purposed_student.balance ,
                 "اخر عمليه دفع": purposed_student.recent_Payment , 
                "اخر مصاريف اضافت": purposed_student.recent_expenses , 
                "عدد مرات الدفع": purposed_student.times_of_payment ,
                "اجمالي الدفعات": purposed_student.Total_paid ,

             });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    add_expenses: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const {expenses} = req.body;
            const {expenses_name} = req.body;
            expenses_int = parseInt(expenses)
            const purposed_student = await student_model.findById(student_ID);
            if (!purposed_student) {
                return res.status(404).send({ message: "لم يتم العثور على الطالب بهذا المعرف .. الرجاء إدخال المعرف الصحيح" });
            }

            if (purposed_student.balance === 0) {
                purposed_student.Remaining_payment +=expenses_int;
            }else if (purposed_student.balance && expenses_int < purposed_student.balance) {
                purposed_student.balance = purposed_student.balance - expenses_int;
            }else {
                purposed_student.Remaining_payment = expenses_int - purposed_student.balance;
                purposed_student.balance = 0;
            }

            purposed_student.recent_expenses = expenses;
            purposed_student.expenses_name = expenses_name;
            purposed_student.times_of_expenses += 1;
            
            purposed_student.Total_expenses += expenses_int;
            await purposed_student.save();

            req.user.Total_expenses += expenses_int;
            req.user.times_of_expenses += 1;
            await req.user.save();
            
            await sysAction_Model.create({
                student : student_ID ,
                employee: req.user._id,
                branch: req.user.branch ,
                expenses : expenses_int ,
                action: ` ${req.user.email} this user made a expenses of ${expenses} to 
                student national_ID : ${purposed_student.national_ID} , 
                name : ${purposed_student.Name} `,
            });

            res.status(200).json({  "حالة العمليه ": req.body.cost_string || "تم اضافة المصاريف بنجاح" ,
                 "الباقي": purposed_student.Remaining_payment ,
                 "اخر عمليه دفع": purposed_student.recent_Payment , 
                 " رصيد الطالب الان": purposed_student.balance,
                 "اخر مصاريف اضافت": purposed_student.recent_expenses , 
                 "اجمالي المصاريف المدفوعه حتي الان": purposed_student.Total_expenses ,
                 "دفع المصاريف لاجل" : purposed_student.expenses_name ,

             });

        } catch (error) {
            res.status(500).json({ status: "failed", message: error.message });
        }
    },
    //////////////////
     search_On_student: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({ message: "enter the Name or national_ID you want to search" })
            }
            const search_int = parseInt(search)
            const search_On_student = await student_model.find({
                    // national_ID: { $regex: search_int } ,
                    national_ID: search_int
            })
            if (search_On_student.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no student found with this national_ID"
                })
            }
            res.status(200).send(search_On_student);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    search_On_employee: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({ message: "enter the Name you want to search" })
            }
            const search_On_employee = await employee_model.find({
                email: { $regex: search, $options: "i" }
            })
            if (search_On_employee.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no employee found with this name "
                })
            }
            res.status(200).send(search_On_employee);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },    
    search_On_student_by_name: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({ message: "enter the Name you want to search" })
            }
            const search_On_student = await student_model.find({
                Name: { $regex: search, $options: "i" }
            })
            if (search_On_student.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no student found with this name "
                })
            }
            res.status(200).send(search_On_student);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },


}

module.exports = employee_Controller ;