import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./category.endPoint.js";
import * as category from './controller/category.js'
import subcategory from "../subcategory/subcategory.router.js";
const router = Router()


router.use('/:categoryId/subcategory',subcategory)

router.get("/", category.categoryList)

router.post('/', auth(endPoint.createCategory), myMulter(fileValidation.image).single('image'),
    category.createCategory)


router.put('/:id', auth(endPoint.updateCategory), myMulter(fileValidation.image).single('image'),
    category.updateCategory)



export default router