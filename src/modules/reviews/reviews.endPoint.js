import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addReview: [roles.User , roles.Admin]
}