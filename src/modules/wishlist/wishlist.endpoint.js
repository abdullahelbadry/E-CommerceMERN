import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addOrRemove: [roles.User, roles.Admin]
}