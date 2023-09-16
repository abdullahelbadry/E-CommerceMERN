import { Router } from "express";
import { auth } from '../../middleware/auth.js'
import { endPoint } from "./product.endPoint.js";

import { fileValidation, myMulter } from "../../services/multer.js";
import * as product from './controller/product.js'
import wishlistRouter from '../wishlist/wishlist.router.js'
import reviewsRouter from '../reviews/reviews.router.js'

const router = Router()


router.use('/:productId/wishlist', wishlistRouter)
router.use('/:productId/review', reviewsRouter)

router.post('/',
    auth(endPoint.create),
    myMulter(fileValidation.image).array('image', 5),
    product.createProduct)

router.put('/:id',
    auth(endPoint.create),
    myMulter(fileValidation.image).array('image', 5),
    product.updateProduct)
    
router.get('/' , product.productList)

export default router