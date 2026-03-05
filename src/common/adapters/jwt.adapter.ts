import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export class JWTAdapter {
    private readonly secret = process.env['JWT_SECRET'] || 'default_secret';
    generateToken(payload: JwtPayload, expireIn: string) {
        return sign(payload, this.secret, { expiresIn: expireIn as SignOptions['expiresIn'] })
    }

    decodeToken(token: string) {
        return verify(token, this.secret)
    }
}