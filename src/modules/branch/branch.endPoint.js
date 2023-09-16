import { roles } from "../../middleware/auth.js";



export const endPoint  = {
    createBranch:[roles.Admin, roles.Accounting],
    updateBranch:[roles.Admin]
}