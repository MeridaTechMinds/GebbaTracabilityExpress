import { request, Router } from "express";
import { machineryModal } from "../Model/machinerayModel.mjs";

export const machineryRouter = Router()


// Post the data
machineryRouter.post('/machinery', async (request, response) => {
    let { body } = request
    try {
        const machineryObj = new machineryModal(body)
        const savedobj = await machineryObj.save()
        return response.send()

    } catch (error) {
        console.log(error);
        return response.status(400).send(error)
    }
})
// Machiner get and Get all
machineryRouter.get('/machinery/:id?', async (request, response) => {
    let { params: { id } } = request
    try {
        if (!id) {
            const getAll = await machineryModal.find({})
            return response.send(getAll)
        } else {
            const getParticular = await machineryModal.findById(id)
            if (getParticular)
                return response.send(getParticular)
            return response.status(404).send("Machinery not found in the ID")
        }
    } catch (error) {
        console.log(error);
        return response.status(400).send(error)
    }
})

//update the machinery