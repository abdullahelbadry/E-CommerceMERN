import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./wishlist.endPoint.js";
import * as wishlist from './controller/wishlist.js'
const router = Router({ mergeParams: true })


router.patch('/add', auth(endPoint.addOrRemove), wishlist.addToWishlist)
router.patch('/remove', auth(endPoint.addOrRemove), wishlist.pullFromWishlist)





export default router