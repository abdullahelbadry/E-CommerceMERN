import { create, find, findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import slugify from "slugify";
import { paginate } from '../../../services/pagination.js'
export const createBrand = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            return next(new Error('image required', { cause: 400 }))
        } else {


            const { name } = req.body
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Friday/Brand` })
            const brand = await create({
                model: brandModel,
                data: {
                    name,
                    slug: slugify(name),
                    image: secure_url,
                    createdBy: req.user._id,
                    imagePublicId: public_id,
                }
            })
            if (brand) {
                return res.status(201).json({ message: "Done", brand })
            } else {
                await cloudinary.uploader.destroy(public_id)
                return next(new Error('Fail to add brand', { cause: 400 }))
            }


        }

    }
)

export const updateBrand = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;

        if (req.file) {
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path,
                    {
                        folder: `E-commerce/Friday/Brand`
                    })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }

        req.body.updatedBy = req.user._id


        const brand = await findByIdAndUpdate({
            model: brandModel,
            filter: id,
            data: req.body,
            options: { new: false }
        })
        if (!brand) {
            await cloudinary.uploader.destroy(req.body.imagePublicId)
            return next(new Error('in-valid category or brand IDs', { cause: 400 }))
        } else {
            await cloudinary.uploader.destroy(brand.imagePublicId)
            return res.status(200).json({ message: "Done", brand })
        }
    }
)

export const brands = asyncHandler(
    async (req, res, next) => {

        const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })
        const brands = await find({
            model: brandModel, populate: [{
                path: "createdBy",
                select: "userName image email"
            }],
            skip,
            limit
        })
        return res.status(200).json({ message: "Done", brands })
    }
)










