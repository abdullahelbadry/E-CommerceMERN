import { create, find, findByIdAndDelete, updateOne } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagination.js";


export const categoryList = asyncHandler(
    async (req, res, next) => {
        const populate = [
            {
                path: 'createdBy',
                select: "userName email"
            },
            {
                path: 'updatedBy',
                select: "userName email"
            },
            {path:'SubCategory'}
        ]

        const { skip, limit } = paginate({page:req.query.page, size:req.query.size})
        const categories = await find({ model: categoryModel, populate, skip, limit})

        // const categories = []
        // const cursor = categoryModel.find({}).limit(limit).skip(skip).populate(populate).cursor();

        // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        //     console.log(doc); // Prints documents one at a time
        //     const covObj = doc.toObject()
        //     const subCategories = await find({
        //         model: subcategoryModel,
        //         filter: { categoryId: covObj._id },
        //         populate
        //     })


        //     covObj.subcategoriesList = subCategories
        //     categories.push(covObj)
        // }
        res.status(200).json({ message: "Done", categories })

    }
)

export const createCategory = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            next(new Error('image required', { cause: 400 }))
        } else {
            const { name } = req.body
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/Friday/categories' })
            const category = await create({ model: categoryModel, data: { image: secure_url, name, createdBy: req.user._id, imagePublicId: public_id } })
            res.status(201).json({ message: "Done", category })
        }
    }
)



export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/Friday/categories' })
            req.body.image = secure_url;
            req.body.imagePublicId = public_id
        }
        req.body.updatedBy = req.user._id
        console.log(req.body);
        const category = await updateOne({ model: categoryModel, filter: { _id: id }, data: req.body })
        console.log(category.imagePublicId);
        await cloudinary.uploader.destroy(category.imagePublicId)
        res.status(201).json({ message: "Done", category })

    }
)

// export const deleteCategory = asyncHandler(
//     async (req, res, next) => {
//         const { id } = req.params
//         const { imagePublicId } = await findByIdAndUpdate({ model: categoryModel, filter: { _id: id }, data: { deletedBy: req.user._id, deleted: true } })
//         await cloudinary.uploader.destroy(imagePublicId)
//         res.status(201).json({ message: "Done" })
//     }
// )
