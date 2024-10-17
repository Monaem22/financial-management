const router = require("express").Router();
const branches_Controller = require ("../controller/branches.controller")
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");

router.get("/show_All_branches", branches_Controller.get_all_branches);
router.get("/show_one_branche/:branche_ID", branches_Controller.get_one_branche);
router.post("/add_branche", branches_Controller.add_branche);
router.delete("/delete_branch/:branche_ID", branches_Controller.delete_branche);
router.put("/update_branche/:branche_ID", branches_Controller.update_branche);

router.post("/add_course_to_branche/:branch_ID", branches_Controller.add_course_to_branche);
router.delete("/delete_course_from_branch/:branch_ID", branches_Controller.delete_course_from_branch);

router.get("/show_branch_courses/:branch_ID", branches_Controller.show_branch_courses);
router.get("/show_branch_employees/:branch_ID", branches_Controller.show_branch_employees);

module.exports = router