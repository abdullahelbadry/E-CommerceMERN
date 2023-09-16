import { create, findByID, findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import cartModel from "../../../../DB/model/cart.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";




export const addToCart = asyncHandler(async (req, res, next) => {

    const findCart = await findOne({
        model: cartModel,
        filter: { userId: req.user._id }
    })
    // product

    if (findCart) {
        //update
        for (const product of req.body.products) {

            const findProduct = await findOne({
                model: productModel,
                filter: {
                    _id: product.productId,
                    stock: {
                        $gte: product.quantity
                    },
                    deleted: false
                }
            })
            if (findProduct) {
                let match = false;
                for (let i = 0; i < findCart.products.length; i++) {
                    if (product.productId == findCart.products[i].productId.toString()) {
                        findCart.products[i] = product
                        match = true
                    }
                }
                if (!match) {
                    findCart.products.push(product)
                }
            }

        }
        const result = await findOneAndUpdate({
            model: cartModel,
            filter: { userId: req.user._id },
            data: { products: findCart.products },
            options: { new: true }
        })
        return res.json({ message: "Done", result })
    } else {
        //create
        const newCart = await create({
            model: cartModel,
            data: {
                userId: req.user._id,
                products: req.body.products
            }
        })
        return res.status(201).json({ message: "Cart Module" })

    }
})