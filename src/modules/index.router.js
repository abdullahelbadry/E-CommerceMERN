import authRouter from './auth/auth.router.js'
import branRouter from './brand/brand.router.js'
import cartRouter from './cart/cart.router.js'
import categoryRouter from './category/category.router.js'
import couponRouter from './coupon/coupon.router.js'
import branchRouter from './branch/branch.router.js'
import orderRouter from './order/order.router.js'
import productRouter from './product/product.router.js'
import reviewsRouter from './reviews/reviews.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'
import userRouter from './user/user.router.js'
import morgan from 'morgan'
import { globalErrorHandling } from '../services/errorHandling.js'
import connectDB from '../../DB/connection.js'
import express from 'express'
import cors from 'cors'

export const appRouter = (app) => {
    //BaseUrl
    const baseUrl = process.env.BASEURL

        //convert Buffer Data
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cors({}))
    // check env mood
    if (process.env.MOOD === 'DEV') {
        app.use(morgan('dev'))
    } else {
        app.use(morgan('short'))
    }

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Home Page" })
    })
    //routing
    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/user`, userRouter)
    app.use(`${baseUrl}/product`, productRouter)
    app.use(`${baseUrl}/branch`, branchRouter)
    app.use(`${baseUrl}/category`, categoryRouter)
    app.use(`${baseUrl}/subCategory`, subcategoryRouter)
    app.use(`${baseUrl}/reviews`, reviewsRouter)
    app.use(`${baseUrl}/coupon`, couponRouter)
    app.use(`${baseUrl}/cart`, cartRouter)
    app.use(`${baseUrl}/order`, orderRouter)
    app.use(`${baseUrl}/brand`, branRouter)
    app.use('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    //handel error
    app.use(globalErrorHandling)
    //DB connection
    connectDB()
}
