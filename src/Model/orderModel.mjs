import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    material_no: {
        type: mongoose.Schema.Types.String,
    },
    incharge:
        [{
            employee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'employee'
            },
            active: {
                type: Boolean
            }
        }],
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
    ],
    closed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    closed_date: {
        type: mongoose.Schema.Types.Date,
    },
    closing_statement: {
        type: mongoose.Schema.Types.String
    }
})

const stagesSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order',
            default: ''
        },
        next_stage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'stages',
            default: null
        },
        prev_stage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'stages',
            default: null
        },
        can_add_material: {
            type: Boolean,
            default: false
        },
        goodQuality: {
            type: Number
        },
        badQuantity: {
            type: Number
        },
        confimation_no: {
            type: mongoose.Schema.Types.String
        },
        stage_name: {
            type: mongoose.Schema.Types.String
        },
        coments: {
            type: String
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
                part_number: {
                    type: mongoose.Schema.Types.String,
                },
                machinery: {
                    type: String
                },
                scannedTime: {
                    type: mongoose.Schema.Types.Date,
                    default: new Date()
                },
                incharge: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'employee'
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
