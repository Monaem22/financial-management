const student_model = require("../models/student.model")
const sysAction_Model = require("../models/system-actions.model")
const employee_model = require("../models/employee.model");


const sysAction_Controller = {
    show_All_payment_SysActions: async (req, res) => {
        try {
            let {date} = req.body  ;
            const All_SysActions = await sysAction_Model.find({payment :{$ne:null} ,date : date })
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 })
                
            if(!All_SysActions.length){
                    return res.status(404)
                            .send({ message: "no Actions founded " });
            }

            if(All_SysActions.length === 0){
                return res.status(404)
                        .send({ message: "no Actions founded " });
            }
            const sum_all_payments = All_SysActions.map((payment) => payment.payment)
                .reduce((acc, payment) => acc + payment , 0);
            const SysActions_count = await sysAction_Model.countDocuments({payment :{$ne:null} ,date : date });

            res.status(202).send({ number_of_SysActions : SysActions_count , 
                "total amount paid" : sum_all_payments ,
                All_SysActions});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    show_All_expenses_SysActions: async (req, res) => {
        try {
            const All_SysActions = await sysAction_Model.find({expenses :{$ne:null} })
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });
            
            if(All_SysActions.length === 0){
                return res.status(404)
                            .send({ message: "no Actions founded " });
            }
            const sum_all_expenses = All_SysActions.map((doc) => doc.expenses)
                .reduce((acc, expenses) => acc + expenses , 0);
            const SysActions_count = await sysAction_Model.countDocuments({expenses :{$ne:null}});

            res.status(202).send({ number_of_SysActions : SysActions_count , 
                "total amount expenses" : sum_all_expenses ,
                All_SysActions});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //branch
    show_All_payment_SysActions_for_branch : async (req, res) => {
        try {
            const {branch_ID} = req.params;
            if (req.body.date) {
                const {date} = req.body ;
                const All_SysActions = await sysAction_Model.find({branch : branch_ID ,payment :{$ne:null} ,date : date })
                        .populate("employee", "_id email image")
                        .sort({ creationTime: -1 });

                if(All_SysActions.length === 0){
                    return res.status(404)
                                .send({ message: "no Actions founded for this branch" });
                }
                const sum_all_payments = All_SysActions.map((payment) => payment.payment)
                    .reduce((acc, payment) => acc + payment , 0);
                const SysActions_count = await sysAction_Model
                    .countDocuments({branch : branch_ID ,payment :{$ne:null},date : date });

                return res.status(202).send
                    ({ number_of_SysActions : SysActions_count , 
                        "total amount paid" : sum_all_payments ,
                        All_SysActions
                });
            }

            const All_SysActions = await sysAction_Model.find({branch : branch_ID ,payment :{$ne:null}})
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });

            if(All_SysActions.length === 0){
                return res.status(404)
                            .send({ message: "no Actions founded for this branch" });
            }
            const sum_all_payments = All_SysActions.map((payment) => payment.payment).reduce((acc, payment) => acc + payment , 0);
            const SysActions_count = await sysAction_Model.countDocuments({branch : branch_ID ,payment :{$ne:null}});

            res.status(202).send({ number_of_SysActions : SysActions_count , 
                "total amount paid" : sum_all_payments ,
                All_SysActions});

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    show_All_expenses_SysActions_for_branch : async (req, res) => {
        try {
            const {branch_ID} = req.params ;
            if (req.body.date) {
                const {date} = req.body ;
                const All_SysActions = await sysAction_Model
                .find({branch : branch_ID ,expenses :{$ne:null} ,date : date })
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });

                if(All_SysActions.length === 0){
                    return res.status(404)
                            .send({ message: "no Actions founded for this branch" });
                }

                const sum_all_expenses = All_SysActions.map((doc) => doc.expenses)
                    .reduce((acc, expenses) => acc + expenses , 0);
                const SysActions_count = await sysAction_Model
                    .countDocuments({branch : branch_ID ,expenses :{$ne:null},date : date });

                return res.status(202).send
                    ({ number_of_SysActions : SysActions_count , 
                        "total amount expenses" : sum_all_expenses ,
                        All_SysActions
                });
            }

            const All_SysActions = await sysAction_Model.find({branch : branch_ID ,expenses :{$ne:null}})
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });

            if(All_SysActions.length === 0){
                return res.status(404)
                        .send({ message: "no Actions founded for this branch" });
            }

            const sum_all_expenses = All_SysActions.map((doc) => doc.expenses)
                .reduce((acc, expenses) => acc + expenses , 0);
            const SysActions_count = await sysAction_Model.countDocuments({branch : branch_ID ,expenses :{$ne:null}});

            res.status(202).send({ number_of_SysActions : SysActions_count , 
                "total amount expenses" : sum_all_expenses ,
                All_SysActions});

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //employee
    show_payment_SysActions_Of_Specific_employee: async (req, res) => {
        try {
            const {employee_ID} = req.params;
            if (req.body.date) {
                    const {date} = req.body ;
                    const all_Specific_employee_Actions = await sysAction_Model
                            .find({ employee : employee_ID ,payment :{$ne:null} , date : date })
                            .populate("employee", "_id email image")
                            .sort({ creationTime: -1 });

                    if (all_Specific_employee_Actions.length === 0) {
                        return res.status(404)
                            .send({ message: "no Actions founded for this user" });
                    }

                    const sum_all_payments = all_Specific_employee_Actions.map((payment) => payment.payment)
                        .reduce((acc, payment) => acc + payment , 0);
                    const SysActions_count = await sysAction_Model
                        .countDocuments({ employee : employee_ID ,payment :{$ne:null}, date : date });

                    const actions_Owner = await employee_model.findById(employee_ID);
                    if (!actions_Owner) {
                        // const deletedActions = await sysAction_Model.deleteMany
                        // ({
                        //     employee: employee_ID,
                        // });

                        return res.status(404).send
                            ({ message:
                                    `this user not found or deleted before  `
                                    // this all actions are deleted from system `,
                            });
                    }

                    return res.status(202).send({ 
                        number_of_SysActions : SysActions_count ,
                        "total amount paid" : sum_all_payments ,
                        all_Specific_employee_Actions });
            }

            const all_Specific_employee_Actions = await sysAction_Model.find({ employee : employee_ID ,payment :{$ne:null}})
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });

            if (all_Specific_employee_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no Actions founded for this user" });
            }

            const SysActions_count = await sysAction_Model.countDocuments({ employee : employee_ID ,payment :{$ne:null}});
            const actions_Owner = await employee_model.findById(employee_ID);
            if (!actions_Owner) {
                // const deletedActions = await sysAction_Model.deleteMany({
                //     employee: employee_ID,
                // });
                return res.status(404).send({ message:
                            `this user not found or deleted before , `
                            // this all actions are deleted from system `,
                    });
            }

            res.status(202).send({ 
                number_of_SysActions : SysActions_count ,
                "total amount paid" : actions_Owner.Total_paid ,
                all_Specific_employee_Actions });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    show_expenses_SysActions_Of_Specific_employee: async (req, res) => {
        try {
            const {employee_ID} = req.params;
            if (req.body.date) {
                    const {date} = req.body ;
                    const all_Specific_employee_Actions = await sysAction_Model
                            .find({ employee : employee_ID ,expenses :{$ne:null} ,date : date })
                            .populate("employee", "_id email image")
                            .sort({ creationTime: -1 });

                    if (all_Specific_employee_Actions.length === 0) {
                        return res.status(404)
                            .send({ message: "no Actions founded for this user" });
                    }
                    const sum_all_expenses = all_Specific_employee_Actions.map((doc) => doc.expenses)
                        .reduce((acc, expenses) => acc + expenses , 0);
                    const SysActions_count = await sysAction_Model
                        .countDocuments({ employee : employee_ID ,expenses :{$ne:null} ,date : date});

                    const actions_Owner = await employee_model.findById(employee_ID);
                    if (!actions_Owner) {
                        // const deletedActions = await sysAction_Model.deleteMany
                        // ({
                        //     employee: employee_ID,
                        // });
                        return res.status(404).send({ message:
                                    `this user not found or deleted before , `
                                    // this all actions are deleted from system `,
                            });
                    }

                    return res.status(202).send({ 
                        number_of_SysActions : SysActions_count ,
                        "total amount expenses" : sum_all_expenses ,
                        all_Specific_employee_Actions 
                    });

            }
            
            const all_Specific_employee_Actions = await sysAction_Model.find({ employee : employee_ID ,expenses :{$ne:null}})
                .populate("employee", "_id email image")
                .sort({ creationTime: -1 });

            if (all_Specific_employee_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no Actions founded for this user" });
            }

            const SysActions_count = await sysAction_Model.countDocuments({ employee : employee_ID ,expenses :{$ne:null}});
            const actions_Owner = await employee_model.findById(employee_ID);
            if (!actions_Owner) {
                // const deletedActions = await sysAction_Model.deleteMany
                // ({
                //     employee: employee_ID,
                // });
                return res.status(404).send({ message:
                            `this user not found or deleted before , `
                            // this all actions are deleted from system `,
                    });
            }

            res.status(202).send({ 
                number_of_SysActions : SysActions_count ,
                "total amount expenses" : actions_Owner.Total_expenses ,
                all_Specific_employee_Actions 
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //كشف حساب الطالب 
    show_payment_SysActions_Of_Specific_student: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const all_Specific_student_Actions = await sysAction_Model.find({ student : student_ID ,payment :{$ne:null}})
                .populate("student", "_id image")
                .sort({ creationTime: -1 });

            if (all_Specific_student_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no paid Actions founded for this user" });
            }

            const actions_Owner = await student_model.findById(student_ID);
            if (!actions_Owner) {
                const deletedActions = await sysAction_Model.deleteMany({
                    student: student_ID,
                });
                return res.status(404).send({ message:
                            `this user not found or deleted before , 
                            this all actions are deleted from system `,
                    });
            } 
            const SysActions_count = await sysAction_Model.countDocuments({student : student_ID ,payment :{$ne:null}});

            res.status(202).send({  
                number_of_SysActions : SysActions_count ,
                "total amount paid" : actions_Owner.Total_paid ,
                all_Specific_student_Actions  
            });
        
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    show_expenses_SysActions_Of_Specific_student: async (req, res) => {
        try {
            const {student_ID} = req.params;
            const all_Specific_student_Actions = await sysAction_Model.find({ student : student_ID ,expenses :{$ne:null}})
                .populate("student", "_id image")
                .sort({ creationTime: -1 });

            if (all_Specific_student_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no expenses Actions founded for this student" });
            }

            const actions_Owner = await student_model.findById(student_ID);
            if (!actions_Owner) {
                const deletedActions = await sysAction_Model.deleteMany({
                    student: student_ID,
                });
                return res.status(404).send({ message:
                            `this user not found or deleted before , 
                            this all actions are deleted from system `,
                    });
            }

            const SysActions_count = await sysAction_Model.countDocuments({student : student_ID ,expenses :{$ne:null} });
            res.status(202).send({  
                number_of_SysActions : SysActions_count ,
                "total amount expenses" : actions_Owner.Total_expenses ,
                all_Specific_student_Actions  
            });
        
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    // سحب الاوراق
    show_all_papers_withdrawals_SysActions : async (req, res) => {
        try {
            const all_withdrawals_Actions = await sysAction_Model.find({papers_withdrawal :true})
                .populate("student employee", "_id image")
                .sort({ creationTime: -1 });

            if (all_withdrawals_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no papers withdrawals Actions founded for this user" });
            }
            const sum_all_payments = all_withdrawals_Actions.map((doc) => doc.payment)
                .reduce((acc, payment) => acc + payment , 0);

            const SysActions_count = await sysAction_Model.countDocuments({papers_withdrawal :true });
            res.status(202).send({  
                number_of_SysActions : SysActions_count ,
                "total amount paid" : sum_all_payments ,
                all_withdrawals_Actions  
            });
        
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    show_all_papers_withdrawals_SysActions_for_branch : async (req, res) => {
        try {
            const {branch_ID} = req.params;
            const all_withdrawals_Actions = await sysAction_Model.find({papers_withdrawal :true , branch : branch_ID})
                .populate("student employee", "_id image")
                .sort({ creationTime: -1 });

            if (all_withdrawals_Actions.length === 0) {
                return res.status(404)
                    .send({ message: "no papers withdrawals Actions founded for this branch" });
            }

            const sum_all_payments = all_withdrawals_Actions.map((doc) => doc.payment)
                .reduce((acc, payment) => acc + payment , 0);
            const SysActions_count = await sysAction_Model.countDocuments({papers_withdrawal :true , branch : branch_ID });

            res.status(202).send({  
                number_of_SysActions : SysActions_count ,
                "total amount paid" : sum_all_payments ,
                all_withdrawals_Actions  
            });
        
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },


}

module.exports = sysAction_Controller ;