import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./order.endPoint.js";
import * as order from './controller/order.js'
const router = Router()




router.post('/',auth(endPoint.add), order.placeOrder)




export default router