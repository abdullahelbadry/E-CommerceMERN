import { Schema, model, Types } from "mongoose";


const SubcategorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'email must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    slug: String,
    image: {
        type: String,
        required: [true, 'image is required'],
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
    imagePublicId: String,
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category'
    },
}, {
    timestamps: true
})


const subcategoryModel = model('SubCategory', SubcategorySchema)
export default subcategoryModel