import mongoose from "mongoose";

const stageNameSchema = new mongoose.Schema({
    name : {
        type: mongoose.Schema.Types.String
    },
    active : {
        type: mongoose.Schema.Types.Boolean
    }
})

export const stageNameModel = mongoose.model('stageName', stageNameSchema)