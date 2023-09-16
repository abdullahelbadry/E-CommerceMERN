import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./branch.endPoint.js";
import * as branch from './controller/branch.js'
const router = Router()


/* router.use('/:categoryId/subcategory',subcategory) */

router.get("/", branch.branchList)

router.post('/', auth(endPoint.createBranch), branch.createBranch)


router.put('/:id', auth(endPoint.updateBranch), branch.updateBranch)



export default router