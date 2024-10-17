const router = require("express").Router();
const employeeRouter = require("./employee.routes");
const authRouter = require("./auth.routes");
const branchesRouter = require("./branches.routes");
const courseRouter = require("./course.routes");
const SysActionsRouter = require("./system-actions.routes");

router.use("/employee", employeeRouter)
router.use("/course", courseRouter)
router.use("/branches", branchesRouter)
router.use("/auth", authRouter)
router.use("/system_actions", SysActionsRouter)
// router.use("/user", userRouter, chatsRouter)


module.exports = router;