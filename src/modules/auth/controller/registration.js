import userModel from "../../../../DB/model/User.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../../services/email.js"
import { asyncHandler } from '../../../services/errorHandling.js'
import { findOne, updateOne } from "../../../../DB/DBMethods.js"

export const signup = asyncHandler(
    async (req, res, next) => {

        const { userName, email, password } = req.body

        const user = await findOne({ filter: { email }, model: userModel, select: 'email' })//object , null
        if (user) {
            return next(new Error('Email Exist', { cause: 409 }))
        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND))
            const newUser = new userModel({ userName, email, password: hash })

            const token = jwt.sign({ id: newUser._id }, process.env.emailToken, { expiresIn: '1h' })
            const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
            const message = `<a href='${link}'>Confirm Email</a>`
            const info = await sendEmail(email, 'confirmEmail', message)

            if (info?.accepted?.length) {
                const savedUser = await newUser.save()
                return res.status(201).json({ message: "Done", savedUser: savedUser._id })
            } else {
                return next(new Error("Rejected email", { cause: 400 }))
            }
        }

    }
)

export const confirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded?.id) {
        return next(Error('In-valid Token Payload', { cause: 400 }))
    } else {

        await updateOne({
            userModel,
            filter: { _id: decoded.id, confirmEmail: false },
            data: { confirmEmail: true }
        })
        return res.status(200).redirect(process.env.FEURL)
    }

})


export const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const user = await findOne({ filter: { email }, model: userModel })//object , null
    if (!user) {
        return next(new Error('Email not exist', { cause: 404 }))
    } else {
        if (!user.confirmEmail) {
            return next(new Error('Confirm email first', { cause: 404 }))
        } else {
            if (user.blocked) {
                return next(new Error("Blocked account", { cause: 404 }))
            } else {
                const match = bcrypt.compareSync(password, user.password)
                if (!match) {
                    return next(new Error("In-valid Password", { cause: 400 }))
                } else {
                    const token = jwt.sign({ id: user._id, isLoggedIn: true },
                        process.env.tokenSignature, { expiresIn: 60 * 60 * 24 })
                    return res.status(200).json({ message: "Done", token })

                }
            }
        }

    }
}
)