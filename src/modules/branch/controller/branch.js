import { create, find, updateOne } from "../../../../DB/DBMethods.js";
import branchModel from "../../../../DB/model/branch.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagination.js";


export const branchList = asyncHandler(
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
        ]

        const { skip, limit } = paginate({page:req.query.page, size:req.query.size})
        const branches = await find({ model: branchModel, populate, skip, limit})

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
        res.status(200).json({ message: "Done", branches })

    }
)

export const createBranch = asyncHandler(
    async (req, res, next) => {
            const { name, location } = req.body
            const branch = await create({ model: branchModel, data: { name, location, createdBy: req.user._id} })
            res.status(201).json({ message: "Done", branch })
    }
)



export const updateBranch = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        req.body.updatedBy = req.user._id
        console.log(req.body);
        const branch = await updateOne({ model: branchModel, filter: { _id: id }, data: req.body })
        res.status(201).json({ message: "Done", branch })

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
