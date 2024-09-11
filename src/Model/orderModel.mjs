import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    incharge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    created_date: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    },
    completed_date: {
        type: mongoose.Schema.Types.Date
    },
    status: {
        type: mongoose.Schema.Types.String
    },
    quantity: {
        type: mongoose.Schema.Types.Number
    },
    material_type: {
        type: mongoose.Schema.Types.String
    },
    description: {
        type: mongoose.Schema.Types.String
    },
    Stages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'stages'
        }
    ]
})

const stagesSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order',
            default: ''
        },
        confimation_no: {
            type: mongoose.Schema.Types.String
        },
        stage_name: {
            type: mongoose.Schema.Types.String
        },
        stage_description: {
            type: mongoose.Schema.Types.String
        },
        materials_prepared_by: [
            {
                employee: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'employee'
                },
                material: {
                    type: mongoose.Schema.Types.String,
                },
                machinery: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'machinery'
                },
                scannedTime: {
                    type: mongoose.Schema.Types.Date,
                    default: new Date()
                }
            }
        ],
        assigned_to: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'employee'
            }
        ]
    })

export const orderModel = mongoose.model('order', orderSchema)
export const stageModel = mongoose.model('stages', stagesSchema)
