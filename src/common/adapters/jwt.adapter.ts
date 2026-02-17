import { JwtPayload, sign, SignOptions, verify } from 'jsonwebtoken'

export class JWTAdapter {
    static generateToken(payload: JwtPayload, expireIn: string): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SEED is not defined');
        return sign(payload, secret, { expiresIn: expireIn as SignOptions['expiresIn'] })
    }

    static verifyToken(token: string) {
        return new Promise((resolve, rejects) => {
            if (!process.env.JWT_SECRET) throw new Error('JWT_SEED is not defined')
            verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) rejects(err)
                resolve(decoded)
            })
        })
    }

}