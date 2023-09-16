import { create, find, findByIdAndDelete, updateOne, findByID, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagination.js";
import slugify from "slugify";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
export const createSubCategory = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            return next(new Error('image required', { cause: 400 }))
        } else {
            const { categoryId } = req.params;
            const category = await findByID({
                model: categoryModel,
                filter: categoryId
            })
            if (!category) {
                return next(new Error('In-valid category id', { cause: 404 }))
            } else {
                const { name } = req.body
                const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Friday/categories/${category._id}` })
                const subcategory = await create({
                    model: subcategoryModel,
                    data: {
                        name,
                        slug: slugify(name),
                        image: secure_url,
                        createdBy: req.user._id,
                        imagePublicId: public_id,
                        categoryId: category._id
                    }
                })
                if (subcategory) {
                    return res.status(201).json({ message: "Done", subcategory })
                } else {
                    await cloudinary.uploader.destroy(public_id)
                    return next(new Error('Fail to add subcategory', { cause: 400 }))
                }


            }

        }
    }
)





export const updateSubcategory = asyncHandler(
    async (req, res, next) => {
        const { categoryId, id } = req.params;

        if (req.file) {
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path,
                    {
                        folder: `E-commerce/Friday/categories/${categoryId}`
                    })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }

        req.body.updatedBy = req.user._id


        // const category = await subcategoryModel.findOneAndUpdate({ _id: id, categoryId }, req.body, { new: false })
        const category = await findOneAndUpdate({
            model: subcategoryModel,
            filter: { _id: id, categoryId },
            data: req.body,
            options: { new: false }
        })
        if (!category) {
            await cloudinary.uploader.destroy(req.body.imagePublicId)
            return next(new Error('in-valid category or subcategory IDs', { cause: 400 }))
        } else {
            await cloudinary.uploader.destroy(category.imagePublicId)
            return res.status(200).json({ message: "Done", category })
        }
    }
)


