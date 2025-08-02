import { Request, Response, NextFunction } from "express";
import { verificarJWT } from "../helpers/generarJWT";

export interface AuthenticatedRequest extends Request {
    user?: { id: string };
    token?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token de autenticación no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verificarJWT(token);

    if (!decoded) {
        return res.status(401).json({ message: "Token de autenticación inválido" });
    }

    req.user = { id: decoded.id };
    req.token = token;
    next();
};

