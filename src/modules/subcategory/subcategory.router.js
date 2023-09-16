import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./subcategory.endPoint.js";
import * as subcategory from './controller/subCategory.js'
const router = Router({ mergeParams: true })



router.post('/', auth(endPoint.create), myMulter(fileValidation.image).single('image'),
    subcategory.createSubCategory)


router.put('/:id', auth(endPoint.update), myMulter(fileValidation.image).single('image'),
    subcategory.updateSubcategory)



export default router