import { compare, hash } from 'bcrypt'

export class BcryptAdapter {
    async encryptPassword(password: string){
        const passwordHashed = await hash(password, 10)
        return passwordHashed
    }

    async verifyPassword(password: string, passwordHashed: string){
        const isValid = await compare(password, passwordHashed)
        return isValid
    }
}