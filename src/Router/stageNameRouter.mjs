import { request, response, Router } from "express";
import { stageNameModel } from "../Model/stageModel.mjs";

export const stageNameRouter = Router()

stageNameRouter.post('/', async (request, response) => {
    let { body } = request
    try {
        let stageNameObj = new stageNameModel(body)
        let savedStageName = await stageNameObj.save()
        if (savedStageName)
            return response.send(savedStageName)
        else
            return response.status(400).send("Got error while saving data")
    } catch (error) {
        console.log(error, 'error');
        return response.status(400).send(error)

    }
})
stageNameRouter.get('/:id?', async (request, response) => {
    let { params: { id } } = request
    try {
        if (!id) {
            const getallData = await stageNameModel.find({})
            return response.send(getallData)
        }
        else {
            const getParticularData = await stageNameModel.findById(id)
            if (getParticularData)
                return response.send(getParticularData)
            else
                return response.status(404).send("Stage name not found")
        }
    } catch (error) {
        console.error(error, 'error');
        return response.status(500).send(error)
    }
})

stageNameRouter.put('/:id', async (request, response) => {
    let { params: { id }, body } = request
    try {
        let updateStageName = await stageNameModel.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
        if (updateStageName)
            return response.send(updateStageName)
        else
            return response.status(404).send(updateStageName)
    } catch (error) {
        console.log(error);
        return response.status(400).send(error)
    }
})

stageNameRouter.delete('/:id', async (request, response) => {
    let { params: { id } } = request
    try {
        const deleteStageName = await stageNameModel.findByIdAndDelete(id)
        if (deleteStageName)
            return response.send("Deleted successfully")
        return response.status(404).send("Not found the StageName")
    } catch (error) {
        console.log(error);
        return response.status(400).send(error)

    }
})