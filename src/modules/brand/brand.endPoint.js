import { roles } from "../../middleware/auth.js";



export const endPoint  = {
    create:[roles.Admin, roles.Accounting],
    update:[roles.Admin]
}