import { JwtPayload, sign } from 'jsonwebtoken'

export class JWTAdapter {
    generateToken(payload: JwtPayload): string {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SEED is not defined')
        return sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    }
}