import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JWTAdapter {
    static generateToken(payload: JwtPayload): string {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SEED is not defined')
        return sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    }

    static verifyToken(token: string) {
        return new Promise((resolve, rejects) => {
            if (!process.env.JWT_SECRET) throw new Error('JWT_SEED is not defined')
            verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) rejects(err)
                resolve(decoded)
            })
        })
    }

}