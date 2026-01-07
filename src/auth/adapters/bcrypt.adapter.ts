import { compare, hash } from 'bcrypt'


export class BcryptAdapter {
    encryptPassword(password: string): Promise<string> {
        return new Promise( (resolve, rejects) => {
            hash(password, 10, (err, hash) => {
                if(err) rejects(err)
                resolve(hash)
            })
        })
    }

    comparePassword(hash: string, password: string): Promise<boolean> {
        return new Promise( (resolve, rejects) => {
            compare(password, hash, (err, result) => {
                if (err) rejects(err)
                resolve(result)
            })
        })
    }
}