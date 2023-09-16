
import { Schema, model, Types } from "mongoose";


const cartSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: [true, 'userId is required'],
        unique: [true, 'only one cart is valid per each  user'],
        ref: 'User'
    },
    products: {
        type: [
            {
                productId: {
                    type: Types.ObjectId,
                    ref: 'Product',
                    required: [true, "productID  is required"],
                    unique: [true, 'can not add the same  product twice'],

                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: [true, "productID  is required"],
                    min: [1, 'minimum is 1']
                }
            }
        ]
    }

}, {
    timestamps: true,
})



const cartModel = model('Cart', cartSchema)
export default cartModel