const router = require("express").Router();
const SysActions_Controller = require ("../controller/system-actions.controller")
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");



//all
router.get("/show_All_payment_SysActions", SysActions_Controller.show_All_payment_SysActions);
router.get("/show_All_expenses_SysActions", SysActions_Controller.show_All_expenses_SysActions);
//branch
router.get("/show_All_payment_SysActions_for_branch/:branch_ID", 
    SysActions_Controller.show_All_payment_SysActions_for_branch);
router.get("/show_All_expenses_SysActions_for_branch/:branch_ID", 
    SysActions_Controller.show_All_expenses_SysActions_for_branch);
//employee
router.get("/show_payment_SysActions_Of_Specific_employee/:employee_ID", 
        SysActions_Controller.show_payment_SysActions_Of_Specific_employee);
router.get("/show_expenses_SysActions_Of_Specific_employee/:employee_ID", 
        SysActions_Controller.show_expenses_SysActions_Of_Specific_employee);
//student
router.get("/show_payment_SysActions_Of_Specific_student/:student_ID", 
        SysActions_Controller.show_payment_SysActions_Of_Specific_student);
router.get("/show_expenses_SysActions_Of_Specific_student/:student_ID", 
        SysActions_Controller.show_expenses_SysActions_Of_Specific_student);
//سحب ورق
router.get("/show_all_papers_withdrawals_SysActions", SysActions_Controller.show_all_papers_withdrawals_SysActions);
router.get("/show_all_papers_withdrawals_SysActions_for_branch/:branch_ID", 
    SysActions_Controller.show_all_papers_withdrawals_SysActions_for_branch);
    
module.exports = router