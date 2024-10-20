const router = require("express").Router();
const employee_Controller = require ("../controller/employee.controller")
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");
const uploading = require("../middleware/uploud.middleware");

//student    Qualification_certificate_Uploading
router.post("/add_student",authentication, employee_Controller.add_student);
router.get("/get_student/:student_ID", employee_Controller.get_Student);
router.get("/get_All_students_with_Custom_Academic_year",authentication, 
    employee_Controller.get_All_students_with_Custom_Academic_year);
router.get("/get_All_Students_for_All_Branches", 
    employee_Controller.get_All_Students_for_All_Branches);
router.put("/update_student/:student_ID", employee_Controller.update_Student);
router.delete("/delete_student/:student_ID", employee_Controller.delete_Student);
router.patch("/Update_Image/:student_ID", uploading.img_Uploading().single("application"), 
    employee_Controller.Update_Image);
router.patch("/upload_Qualification_certificate/:student_ID", uploading.Qualification_certificate_Uploading().single("application"), 
    employee_Controller.upload_Qualification_certificate);
router.patch("/upload_personal_ID_card/:student_ID", uploading.personal_ID_card_Uploading().single("application"), 
    employee_Controller.upload_personal_ID_card);

router.post("/add_payment/:student_ID",authentication, employee_Controller.add_payment);
router.post("/add_expenses/:student_ID",authentication, employee_Controller.add_expenses);
//employee
router.get("/get_all_employees" ,employee_Controller.get_all_employees);
router.get("/get_one_employee/:employee_ID", employee_Controller.get_one_employee);
router.delete("/delete_employee/:employee_ID", employee_Controller.delete_employee);
router.post("/add_new_employee", employee_Controller.add_new_employee);
router.put("/update_employee/:employee_ID", employee_Controller.update_employee);


router.get("/search_On_student", employee_Controller.search_On_student);
router.get("/search_On_employee", employee_Controller.search_On_employee);
router.get("/search_On_student_by_name", employee_Controller.search_On_student_by_name);

module.exports = router