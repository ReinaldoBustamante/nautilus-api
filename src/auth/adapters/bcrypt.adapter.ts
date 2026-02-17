import { compare, genSalt, hash } from 'bcrypt'


export class BcryptAdapter {
    async encryptPassword(password: string): Promise<string> {
        const salt = await genSalt(10); 
        return hash(password, salt);
    }

    async comparePassword(password: string, hashStr: string): Promise<boolean> {
        return compare(password, hashStr);
    }
}