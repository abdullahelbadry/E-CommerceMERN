


export function asyncHandler(fun) {
    return (req, res, next) => {
        fun(req, res, next).catch(err => {
            // res.status(500).json({message:"Catch error" , err:err.message , stack:err.stack})
            next(new Error(err.message, { cause: 500 }))
        })
    }
}


export const globalErrorHandling = (err, req, res, next) => {
    if (process.env.MOOD === 'DEV') {
        if (err) {
            res.status(err['cause']).json({
                message: "error",
                err: err.message,
                stack: err.stack
            })
        }
    } else {
        if (err) {
            res.status(err['cause']).json({ message: "error", err: err.message })
        }
    }

}