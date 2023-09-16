import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'email must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true

    },
    slug: String,
    description: String,
    stock: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        default: 1
    },
    soldItems: {
        type: Number,
        default: 0
    },
    colors: [String],
    size: { type: [String], enum: ['s', 'l', 'm', 'xl'] },
    images: {
        type: [String],
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
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required:[true ,'category id required']
    },
    subcategoryId: {
        type: Types.ObjectId,
        ref: 'SubCategory',
        required:[true ,'subcategory id required']

    },
    brandId: {
        type: Types.ObjectId,
        ref: 'Brand',
        required:[true ,'Brand id required']

    },
    deleted: { type: Boolean, default: false },
    imagesPublicIds:  [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

 
productSchema.virtual('reviewId', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId',
})


const productModel = model('Product', productSchema)
export default productModel