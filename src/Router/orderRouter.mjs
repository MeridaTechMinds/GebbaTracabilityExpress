import { request, response, Router } from "express";
import { orderModel, stageModel } from "../Model/orderModel.mjs";
import { userModel } from "../Model/userModel.mjs";
import path from "path";

export const orderRouter = Router()
//post the data
orderRouter.post('/order', async (request, response) => {
    const { body } = request

    try {
        const orderObjt = new orderModel(body)
        let savedOrderObj = await orderObjt.save()
        console.log(savedOrderObj);

        const stagesArray = [...body.stages]
        console.log(stagesArray);

        let collectedIds = []
        if (stagesArray && stagesArray.length > 0)
            for (let obj of stagesArray) {
                let modelObj = new stageModel(obj);
                modelObj.orderId = savedOrderObj._id;
                let savedObj = await modelObj.save();
                collectedIds.push(savedObj._id);
            }
        console.log(collectedIds);

        savedOrderObj.Stages = collectedIds
        savedOrderObj.status = "open"

        let savedOrder = await (await savedOrderObj.save()).populate('Stages')
        if (savedOrder)
            return response.send(savedOrder)
        else
            return response.status(400).send("Error Aquired")
    } catch (error) {
        console.log(error);

        return response.status(400).send(error)
    }
})
// Update the Order
orderRouter.put('/order/:id', async (request, response) => {
    let { body,
        params: { id } } = request
    if (!id) {
        return response.status(400).send("Enter the ID")
    }
    try {
        let stages = [...body.stages]
        let collectedIds = []
        if (stages.length > 0) {
            for (const stage of stages) {
                if (!stage._id) {
                    let newStage = new stageModel(stage)
                    newStage.orderId = id
                    const savedStage = await newStage.save()
                    collectedIds.push(savedStage._id)
                }
                else {
                    let updateStage = await stageModel.findByIdAndUpdate(stage._id, stage, { new: true })
                    collectedIds.push(updateStage._id)
                }
            }
        }
        body.Stages = collectedIds
        const updateOrder = await orderModel.findByIdAndUpdate(id, { $set: body },
            { new: true })
        return response.send("Updated")
    } catch (error) {
        console.log(error);
        return response.status(400).send(error);
    }
})

// All Orders and the particular orders
orderRouter.get('/order/:id?', async (request, response) => {
    let { params: { id } } = request
    try {
        if (!id) {
            let findAll = await orderModel.find({}).populate([{
                path: 'Stages',
                populate: [{
                    path: 'assigned_to'
                }, {
                    path: 'materials_prepared_by.employee'
                }
                ]
            }, {
                path: 'incharge'
            }])
            return response.send(findAll)
        }
        let findParticular = await orderModel.findById(id).populate({
            path: 'Stages',
            populate: [{
                path: 'assigned_to'
            }, {
                path: 'materials_prepared_by.employee'
            }
            ]
        })
        if (findParticular)
            return response.send(findParticular)
        return response.status(404).send("Not Found Order")
    } catch (error) {
        return response.status(400).send(error)
    }
})

//Add the materials prepared by the employee
orderRouter.put('/material/:id', async (request, response) => {
    const { body, params: { id } } = request
    if (!id)
        return response.status(400).send("Send the Stage Id");
    try {
        let getStage = await stageModel.findById(id)
        if (!getStage)
            return response.status(404).send("Not able to find the Stages")
        getStage.materials_prepared_by.push(body)
        console.log(getStage);
        let updatevalue = await stageModel.findByIdAndUpdate(getStage._id, getStage, { new: true })

        return response.send(updatevalue)

    } catch (error) {
        return response.status(400).send(error)
    }
})

// Showing the stages to the employee which are opended for them
orderRouter.get('/stage', async (request, response) => {
    const { query: { empId, status } } = request
    if (!empId) {
        return response.status(400).send("Send the Id")
    }
    try {
        const assignedStages = await stageModel.find({ assigned_to: { $in: [empId] } })
            .populate([{
                path: 'orderId',
                populate: [{
                    path: 'incharge'
                }]
            }, {
                path: 'materials_prepared_by.employee',
            }
            ])
        console.log(assignedStages);
        let filterOrder = assignedStages
        if (status)
            filterOrder = assignedStages.filter((obj, index) => {
                if (obj.orderId && obj.orderId.status == status) {
                    return obj
                }
            })
        return response.send(filterOrder)
    } catch (error) {
        return response.status(400).send(error)
    }
})
// Getting a particular stage
orderRouter.get('/stages/:id?', async (request, response) => {
    let { params: { id } } = request
    try {
        if (!id) {
            let allStages = await stageModel.find({}).populate([{
                path: 'orderId',
                populate: [{
                    path: 'incharge'
                }]
            }, {
                path: 'materials_prepared_by.employee',
            }
            ])
            return response.send(allStages)
        }
        let particularStage = await stageModel.findById(id)
            .populate([{
                path: 'orderId',
                populate: [{
                    path: 'incharge'
                }]
            }, {
                path: 'materials_prepared_by.employee',
            }
            ])
        if (particularStage)
            return response.send(particularStage)
        return response.status(404).send("Not Found Stage")

    } catch (error) {
        console.log(error);
        return response.status(500).send(error)

    }
})

//Get the order based on the incharge 
orderRouter.get('/inchargeOrders/:id', async (request, response) => {
    let { params: { id } } = request
    if (!id) {
        return response.status(400).send("Send the Id")
    }
    try {
        let findOrderForIncharge = await orderModel.find({ incharge: id }).populate([{
            path: 'Stages',
            populate: [{
                path: 'assigned_to'
            }, {
                path: 'materials_prepared_by.employee'
            }
            ]
        }, {
            path: 'incharge'
        }])
        return response.send(findOrderForIncharge)
    } catch (error) {
        console.log(error);
        return response.send(error)

    }
})