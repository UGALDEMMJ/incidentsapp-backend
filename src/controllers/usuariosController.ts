import { Request, Response } from "express";
import {
    crearUsuarioService,
    actualizarUsuarioService,
    eliminarUsuarioService,
    getUsuarioService,
    getUsuariosService,
    getUsuarioByEmailService,
    verificarUsuarioService
} from "../services/usuariosService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";


const crearUsuarioController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const nuevaUsuario = await crearUsuarioService({ ...req.body, id_usuario: userId });
        return res.status(201).json({ message: "Usuario creado correctamente", data: nuevaUsuario });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const actualizarUsuarioController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const { id_usuario } = req.params;
        const { data } = req.body;

        const usuarioActualizado = await actualizarUsuarioService({
            id_usuario: id_usuario,
            ...data
        });

        return res.status(200).json({ message: "Usuario actualizado correctamente", data: usuarioActualizado });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const eliminarUsuarioController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const { id_usuario } = req.params;

        await eliminarUsuarioService({ id_usuario });
        return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const getUsuarioController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if (!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const { id_usuario } = req.params;
        const usuario = await getUsuarioService(id_usuario);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({ data: usuario });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getUsuariosController = async ( req: Request, res: Response) => {
    try {
        const usuarios = await getUsuariosService();
        return res.status(200).json({ data: usuarios });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const verificarUsuarioController = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        await verificarUsuarioService(token as string);
        return res.status(200).json({ message: "Usuario verificado correctamente" });
    } catch (error) {
        console.error("Error al verificar usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
