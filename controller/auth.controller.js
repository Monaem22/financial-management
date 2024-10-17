const employee_model = require("../models/employee.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../services/sendEmail");


const authUserController = {

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await employee_model.findOne({ email })
            if (!user) {
                return res.status(403).json({ message: " Inavlid email or password" });
            }
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(403).json({ message: " Inavlid email or password" });
            }
            if (user.isBlocked) {
                return res.status(403).json({ message: " you can't login...you are blocked...Contact the admin to help" });
            }

            const token = await jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.secret_key,
                { expiresIn: '7d' }
            )
            res.cookie("access_token", `barear ${token}`, 
                {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            )

            // user.tokens.push(token );
            user.active = true;
            await user.save();

            return res.status(200).json({ message: "logIn is accepted", token })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            req.user.active = false;
            await req.user.save()
            res.clearCookie("access_token");
            res.status(200).send("you are loged out")
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },

    forgetPassword: async (req, res) => {
        try {
            var userDoc = await employee_model.findOne({ email: req.body.email });
            if (!userDoc) {
                return res.status(403).send({ message: "Email not found" });
            }
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const hashResetCode = crypto.createHash("sha256")
                .update(resetCode)
                .digest("hex");

            userDoc.passwordResetCode = hashResetCode;
            userDoc.passwordResetExpires = Date.now() + 10 * 60 * 1000;
            userDoc.passwordResetVerified = false;
            await userDoc.save();

            var message = ` HI ${userDoc.userName} ,
            we received to rest the password on your account \n
            ${resetCode} thanks `;
            console.log(resetCode);

            await sendEmail({
                email: userDoc.Gmail_Acc,
                subject: `your password reset code(valid for 10 min)`,
                text: message,
            });

            return res.status(200).json({ status: "Success", message: "mail sent" });
        } catch (error) {
            userDoc.passwordResetCode = undefined;
            userDoc.passwordResetExpires = undefined;
            userDoc.passwordResetVerified = undefined;
            await userDoc.save();

            res.status(500).send({ message: error.message })
        }
    },
    verifyPassResetCode: async (req, res) => {
        const resetCode = req.body.resetCode
        if (!resetCode) {
            return res.status(404).send({ message: "no Reset code entered" });
        }
        const hashedResetCode = crypto
            .createHash("sha256")
            .update(resetCode)
            .digest("hex");

        const user = await employee_model.findOne({
            passwordResetCode: hashedResetCode,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(404).send({ message: "Reset code invalid or expired" });
        }
        user.passwordResetVerified = true;
        await user.save();

        res.status(200).json({ status: "Success" });
    },
    resetPassword: async (req, res) => {
        try {
            const user = await employee_model.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).send({ message: `There is no user with email ${req.body.email}` });
            }
            if (!user.passwordResetVerified) {
                return res.status(404).send({ message: "Reset code not verified" });

            }

            const token = await jwt.sign({ id: user._id }, process.env.secret_key, {
                expiresIn: "7d",
            });
            res.cookie("access_token", `barear ${token}`, {
                httpOnly: true,
            })

            user.password = req.body.newPassword;
            user.passwordResetCode = undefined;
            user.passwordResetExpires = undefined;
            user.passwordResetVerified = undefined;
            // user.tokens.push(token)
            await user.save();

            res.status(200).json({ message: "success", token });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
}

module.exports = authUserController;
