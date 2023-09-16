import { Schema, model, Types } from "mongoose";


const branchSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'name must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    location: {
        type: String,
        required: [true, 'location is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    createdBy: {
        type: Types.ObjectId,
        required: [true, 'createdBy is required'],
        ref: 'User'
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

 
/* branchSchema.virtual('SubCategory', {
    ref: 'SubCategory',
    localField: '_id',
    foreignField: 'categoryId',
}) */


const branchModel = model('Branch', branchSchema)
export default branchModel