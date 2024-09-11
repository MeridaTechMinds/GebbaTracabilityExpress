import mongoose from "mongoose";

const machinerySchema = new mongoose.Schema({
    machineryName: {
        type: String
    },
    description: {
        type: String
    },
    machineryId: {
        type: String
    }
})

export const machineryModal = mongoose.model("machinery", machinerySchema)