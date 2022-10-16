import { model, Schema } from 'mongoose'

const schema = new Schema({
    snapshot: {
        type: Object
    }
}, { timestamps: true })

export const AWSSNSLog = model('AWSSNSLog', schema)