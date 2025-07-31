import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = '12h';

interface Payload{
    id: string;
}

export const generarJWT = (payload: Payload): string =>{
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export const generarJWTSignUp = (payload: Payload): string => {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export const  verificarJWT = (token: string): Payload | null => {
    try{
        return jwt.verify(token, SECRET) as Payload;
    }catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
};