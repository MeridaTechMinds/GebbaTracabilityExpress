import { request, response, Router } from "express";
import { userModel } from "../Model/userModel.mjs";
import { comparePassword, hashPassword } from "../Utils/password.mjs";
import { getCurrentDate } from "../Utils/middlewares.mjs";
import { normalMail } from "../Utils/mailSender.mjs";
import { imageUpload, removeFile, singleImagePath } from "../Utils/mediaHandler.mjs";


export const userRouter = Router()

// Save The User
userRouter.post('/user', imageUpload.single('profile'), singleImagePath, async (request, response) => {
    const { body } = request
    if (request.singleImagePath)
        body.profile_pic = request.singleImagePath
    try {
        const findUserEmail = await userModel.findOne({ email: body.email })
        if (findUserEmail) {
            console.log(request.singleImagePath);
            if (request.singleImagePath)
                removeFile(request, request.singleImagePath)
            return response.status(400).send("Email already registered")
        }
        const findUserPhone = await userModel.findOne({ phone: Number(body.phone) })
        if (findUserPhone) {
            if (request.singleImagePath)
                removeFile(request, request.singleImagePath)
            console.log(findUserPhone);
            return response.status(400).send("Phone already registered")
        }
        const findUserEmpId = await userModel.findOne({ empId: body.empId })
        if (findUserEmpId) {
            if (request.singleImagePath)
                removeFile(request, request.singleImagePath)
            return response.status(400).send("Employee Id already registered")
        }
        const lastEmp = await userModel.findOne().sort({ _id: -1 }).exec()

        // let EmpId = ''
        // if (lastEmp) {
        //     let num = Number(lastEmp.empId.slice(-5,)) + 1
        //     let newNum = `GEBBA` + String(num).padStart(5, '0')
        //     EmpId = newNum
        // }
        // else {
        //     EmpId = 'GEBBA00001'
        // }
        let mailData = {
            mail: body.email,
            subject: `Employee creation at GEBBA in ${getCurrentDate()} `,
            text: `Dear ${body.emp_name}\n 
            Your login credentials for the GEBBA tracability is \n
            Email : ${body.email}\n
            Password : ${body.password}`,
        }
        let mailstatus = await normalMail(mailData)
        console.log(mailstatus);

        if (!mailstatus) {
            console.log("mail error");

            return response.status(400).send("Error from the mail")
        }
        const empObj = new userModel(body)
        empObj.status = 'active'
        empObj.password = hashPassword(empObj.password)
        const savedObj = await empObj.save()

        if (savedObj)
            return response.send(savedObj)
        return response.status(404).send("Error came")
    } catch (error) {
        return response.status(401).send({ error })
    }
})

//Get the Employee for the Login
userRouter.post('/userLogin', async (request, response) => {
    const { body } = request
    try {
        console.log(body);

        if (!body.email || !body.password)
            return response.status(400).send("Enter the Credentials")
        let findUser = await userModel.findOne({
            $or: [
                { email: body.email },
                { phone: !isNaN(Number(body.email)) && Number(body.email) },
                { empId: body.email },
            ]
        })
        if (!findUser)
            return response.status(404).send("Employee not found")
        if (findUser.status == 'inactive')
            return response.status(401).send("Account has been blocked")
        if (!comparePassword(body.password, findUser.password))
            return response.status(401).send("Password Mismatched")
        return response.send(findUser)
    } catch (error) {
        return response.status(400).send(error)
    }
})

//Get all the Employee
userRouter.get('/user/:id?', async (request, response) => {
    let { params: { id } } = request
    try {
        if (!id) {
            let getAllUser = await userModel.find({})
            return response.send(getAllUser)
        }
        let findUser = await userModel.findById(id)
        if (!findUser)
            return response.status(404).send(findUser)
        return response.send(findUser)
    } catch (error) {
        return response.status(400).send(error)
    }
})

//Update the user 
userRouter.put('/user', imageUpload.single('profile'), singleImagePath, async (request, response) => {
    const { body } = request;
    if (!body.id) {
        return response.status(400).send({ message: 'Employee ID is required' });
    }

    try {
        if (body.password)
            body.password = hashPassword(body.password)
        if (request.singleImagePath) {
            body.profile_pic = request.singleImagePath
            const userEmp = await userModel.findById(body.id)
            if (userEmp.profile_pic)
                removeFile(request, userEmp.profile_pic)
        }
        const updateEmp = await userModel.findOneAndUpdate(
            { _id: body.id },
            { $set: body }, // Only update fields provided in the body
            { new: true, runValidators: true }
        );
        console.log(updateEmp);

        if (!updateEmp) {
            return response.status(404).send({ message: 'Employee not found' });
        }
        return response.status(200).send(updateEmp);
    } catch (error) {
        console.log(error);
        if (request.singleImagePath)
            removeFile(request, request.singleImagePath)
        return response.status(400).send(error)
    }
})


//Forgot password
userRouter.get('/otp/:email', async (request, response) => {
    const { params: { email } } = request
    let otp = Math.floor(Math.random() * 900000) + 100000;
    try {
        let findUser = await userModel.findOne({
            $or: [
                { email: email },
                { phone: !isNaN(Number(email)) && Number(email) },
                { empId: email },
            ]
        })
        if (!findUser)
            return response.status(404).send("Employee not found")
        let mailOptions = {
            mail: findUser.email,
            subject: `OTP verification in ${getCurrentDate()} `,
            text: `Dear ${findUser.emp_name}\n 
            OTP request has been recived , your OTP is ${otp},`
        }
        let mailstatus = await normalMail(mailOptions)
        if (mailstatus)
            return response.send({
                message: "Mail sended successfully",
                otp: otp,
                id: findUser._id
            })
        else
            return response.status(400).send("Error acquired while sending mail")

    } catch (error) {
        return response.status(400).send(error)
    }
})

//Get all Block employee
userRouter.get('/userStatus/:status', async (request, response) => {
    const { params: { status } } = request
    try {
        const findStatusEmp = await userModel.find({ status: status })
        console.log(findStatusEmp);

        if (findStatusEmp && !findStatusEmp.length <= 0)
            return response.send(findStatusEmp)
        return response.status(404).send("Not Found any employee for the Status")

    } catch (error) {
        return response.send(error);
    }
})

userRouter.get('/adminAuth', async (request, response) => {
    const { body } = request
    let otp = Math.floor(Math.random() * 900000) + 100000;
    let mailOptions = {
        mail: process.env.ADMINMAIL,
        subject: `Employee creation from Sign Up ${getCurrentDate()} `,
        text: `Dear Admin\n 
        Employee creation process is happening in the signUp page use the OTP for the further process,
        , your OTP is ${otp},`
    }
    let mailstatus = await normalMail(mailOptions)
    if (mailstatus)
        return response.send({
            msg: "Mail has been sended to the Admin mail. ",
            otp: otp
        })
    else
        return response.status(500).send("Erorr acquired")
})