import { Request, Response } from "express";
import {
    crearIncidenciaService,
    editarIncidenciaService,
    eliminarIncidenciaService,
    getIncidenciaService,
    getIncidenciasService
} from "../services/incidenciasService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";


const crearIncidenciaController = async (req:  AuthenticatedRequest, res: Response)=>{
    try {
        const userId = req.user?.id || "";
        if(!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const nuevaIncidencia = await crearIncidenciaService({
            id_usuario: userId,
            ...req.body
        });

        return res.status(201).json({message: "Incidencia creada correctamente"});
    } catch (error) {
        console.error("Error al crear incidencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const editarIncidenciaController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if(!userId) return res.status(401).json({ error: "Usuario no autenticado" });
        
        const { id_incidencias } = req.params;
        const { data } = req.body;

        const incidenciaActualizada = await editarIncidenciaService({
            id_incidencias,
            id_usuario: userId,
            ...data
        });

        return res.status(200).json({ message: "Incidencia actualizada correctamente", data: incidenciaActualizada });
    } catch (error) {
        console.error("Error al editar incidencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

const eliminarIncidenciaController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id || "";
        if(!userId) return res.status(401).json({ error: "Usuario no autenticado" });

        const { id_incidencias } = req.params;

        await eliminarIncidenciaService({
            id_incidencias,
            id_usuario: userId
        });

        return res.status(200).json({ message: "Incidencia eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar incidencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const getIncidenciaController = async (req: Request, res: Response) => {
    try {
        const { id_incidencias } = req.params;

        const incidencia = await getIncidenciaService(id_incidencias);
        if (!incidencia) {
            return res.status(404).json({ error: "Incidencia no encontrada" });
        }

        return res.status(200).json(incidencia);
    } catch (error) {
        console.error("Error al obtener incidencia:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const getIncidenciasController = async (req: Request, res: Response) => {
    try {
        const incidencias = await getIncidenciasService();
        return res.status(200).json(incidencias);
    } catch (error) {
        console.error("Error al obtener incidencias:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export {
    crearIncidenciaController,
    editarIncidenciaController,
    eliminarIncidenciaController,
    getIncidenciaController,
    getIncidenciasController
};