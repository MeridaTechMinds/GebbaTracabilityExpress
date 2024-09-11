import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    emp_name: {
        type: mongoose.Schema.Types.String
    },
    empId: {
        type: mongoose.Schema.Types.String
    },
    profile_pic:{
        type: mongoose.Schema.Types.String
    },
    email: {
        type: mongoose.Schema.Types.String
    },
    phone: {
        type: mongoose.Schema.Types.Number
    },
    password: {
        type: mongoose.Schema.Types.String
    },
    emp_type: {
        type: mongoose.Schema.Types.String
    },
    status: {
        type: mongoose.Schema.Types.String
    }
})


export const userModel = mongoose.model('employee', userSchema)