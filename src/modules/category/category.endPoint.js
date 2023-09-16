import { roles } from "../../middleware/auth.js";



export const endPoint  = {
    createCategory:[roles.Admin, roles.Accounting],
    updateCategory:[roles.Admin]
}