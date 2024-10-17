const router = require("express").Router();
const course_Controller = require ("../controller/course.controller")
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");
const employee_Controller = require ("../controller/employee.controller")



router.get("/show_All_courses", course_Controller.get_all_courses);
router.get("/show_one_course/:course_ID", course_Controller.get_one_course);
router.post("/add_course", course_Controller.add_course);
router.delete("/delete_course/:course_ID", course_Controller.delete_course);
router.put("/update_course/:course_ID", course_Controller.update_course);

router.post("/add_student_to_course/:course_ID",authentication, course_Controller.add_student_to_course , 
    employee_Controller.add_expenses);
router.post("/delete_student_from_course/:course_ID", authentication, 
    course_Controller.delete_student_from_course , employee_Controller.add_payment);

router.get("/show_student_courses/:student_ID", course_Controller.show_student_courses);
router.get("/search_On_course_by_name", course_Controller.search_On_course_by_name);



module.exports = router