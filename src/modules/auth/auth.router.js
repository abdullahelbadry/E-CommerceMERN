import { Router } from "express";
import * as registerController from './controller/registration.js'
import * as validators from './auth.validation.js'
import {validation} from '../../middleware/validation.js'
const router = Router()

//register
router.post('/signup', /* validation(validators.signup), */ registerController.signup)
router.get('/confirmEmail/:token', /* validation(validators.token), */  registerController.confirmEmail)

//login
router.post('/login', /* validation(validators.login), */ registerController.login)


export default router