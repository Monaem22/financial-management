const router = require("express").Router();
const authControl = require("../controller/auth.controller");
const { authentication } = require("../middleware/auth.middleware");


router.post("/login", authControl.login)
router.get("/logout",authentication, authControl.logout)

router.post("/forgetPassword", authControl.forgetPassword);
router.post("/verifyRestCode", authControl.verifyPassResetCode);
router.put("/resetPassword", authControl.resetPassword);

module.exports = router;
