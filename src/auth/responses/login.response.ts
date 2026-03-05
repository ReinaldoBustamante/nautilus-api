import { role_type } from "prisma/generated/enums"

export class LoginResponse {
    access_token: string
    user: {
        id: string
        email: string
        role: role_type
    }
}