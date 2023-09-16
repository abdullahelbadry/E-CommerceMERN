import slugify from "slugify";
import { asyncHandler } from "../../../services/errorHandling.js";
import subCategoryModel from '../../../../DB/model/Subcategory.model.js'
import productModel from '../../../../DB/model/product.model.js'
import brandModel from '../../../../DB/model/brand.model.js'
import cloudinary from '../../../services/cloudinary.js'
import { paginate } from "../../../services/pagination.js";

import { create, find, findByID, findOne, findOneAndUpdate, updateOne } from '../../../../DB/DBMethods.js'





export const createProduct = asyncHandler(
    async (req, res, next) => {
        const { subcategoryId, categoryId, brandId, name, totalAmount, price } = req.body
        if (!req.files?.length) {
            return next(new Error("Images are required", { cause: 400 }))
        } else {

            req.body.slug = slugify(name)

            req.body.stock = totalAmount

            req.body.finalPrice = price - (price * ((req.body.discount || 0) / 100))



            const category = await findOne({
                model: subCategoryModel,
                filter: { _id: subcategoryId, categoryId }
            })
            if (!category) {
                return next(new Error('In-valid category or subcategory ids', { cause: 404 }))
            }


            const brand = await findOne({
                model: brandModel,
                filter: { _id: brandId }
            })
            if (!brand) {
                return next(new Error('In-valid brand Id', { cause: 404 }))
            }
            const images = []
            const imagesIDs = []

            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `E-commerce/Friday/categories/${name}` })
                images.push(secure_url)
                imagesIDs.push(public_id)
            }
            req.body.imagesPublicIds = imagesIDs
            req.body.images = images


            req.body.createdBy = req.user._id
            const product = await create({
                model: productModel,
                data: req.body
            })

            return res.status(201).json({ message: "Done", product })

        }
    }
)



export const updateProduct = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params

        const product = await findByID({
            model: productModel,
            filter: id
        })

        if (!product) {
            return next(new Error("Invalid product ID", { cause: 404 }))
        } else {

            const { subcategoryId, categoryId, brandId, name, totalAmount, price, discount } = req.body

            if (req.body.name) {
                req.body.slug = slugify(name)
            }

            if (req.body.totalAmount) {
                const calcStock = totalAmount - product.soldItems
                calcStock > 0 ? req.body.stock = calcStock : req.body.stock = 0
            }


            if (price && discount) {
                req.body.finalPrice = price - (price * (discount / 100))
            } else if (price) {
                req.body.finalPrice = price - (price * (product.discount / 100))
            } else if (discount) {
                req.body.finalPrice = product.price - (product.price * (discount / 100))
            }

            if (subcategoryId && categoryId) {
                const category = await findOne({
                    model: subCategoryModel,
                    filter: { _id: subcategoryId, categoryId }
                })

                if (!category) {
                    return next(new Error('In-valid category or subcategory ids', { cause: 404 }))
                }
            }


            if (brandId) {
                const brand = await findOne({
                    model: brandModel,
                    filter: { _id: brandId }
                })
                if (!brand) {
                    return next(new Error('In-valid brand Id', { cause: 404 }))
                }
            }

            if (req.files?.length) {
                const images = []
                const imagesIDs = []
                for (const file of req.files) {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `E-commerce/Friday/categories/${name}` })
                    images.push(secure_url)
                    imagesIDs.push(public_id)
                }
                req.body.imagesPublicIds = imagesIDs
                req.body.images = images

            }
            req.body.updatedBy = req.user._id
            const productUpdated = await findOneAndUpdate({
                model: productModel,
                filter: id,
                data: req.body,
                options: { new: false }
            })

            if (!productUpdated) {
                for (const i of req.body.imagesPublicIds) {
                    await cloudinary.uploader.destroy(i)
                }
                return next(new Error('Fail to update this product', { cause: 400 }))
            } else {
                for (const i of productUpdated.imagesPublicIds) {
                    await cloudinary.uploader.destroy(i)
                }
                return res.status(201).json({ message: "Done", productUpdated })
            }

        }
    }
)

const populate = [
    {
        path: "createdBy",
        select: "userName email image"
    },
    {
        path: "updatedBy",
        select: "userName email image"
    },
    {
        path: "categoryId",
    },
    {
        path: "subcategoryId",
    },
    {
        path: "brandId",
    },
    {
        path: "reviewId"
    }
]

export const productList = asyncHandler(
    async (req, res, next) => {
        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        const products = await find({
            model: productModel,
            populate,
            limit, skip
        })


        const finalResult = []
        for (let i = 0; i < products.length; i++) {
            let calcAvg = 0
            for (let r = 0; r < products[i].reviewId.length; r++) {
                calcAvg += products[i].reviewId[r].rating

            }
            const covObj = products[i].toObject()
            covObj.avgCalc = calcAvg / products[i].reviewId.length
            finalResult.push(covObj)
        }
        return res.status(200).json({ message: "Done", products: finalResult })
    }
)