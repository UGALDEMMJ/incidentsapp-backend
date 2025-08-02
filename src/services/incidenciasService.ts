import { prisma } from "../config/db";
import { incidenciaDTO, IncidenciaLite } from "../types/Incidencias";
import { cambios } from "../types/Timeline";
import { Request, Response } from "express";

// Define AuthenticatedRequest if not already defined elsewhere
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

const getIncidenciaService = async (id_incidencias: string): Promise<IncidenciaLite | null> => {
    const incidencia = await prisma.incidencias.findUnique({
        where: { id_incidencias },
        select: {
            id_incidencias: true,
            nombre: true,
            descripcion: true,
            fecha_creacion: true,
            prioridad: {
                select: {
                    id_prioridad: true,
                    nombre: true,
                    color: true
                }
            },
            status: {
                select: {
                    id_status: true,
                    nombre: true
                }
            },
            usuarios: {
                select: {
                    id_usuario: true,
                    nombrecompleto: true,
                    username: true,
                    correo: true
                }
            },
            respondersporincidencia: {
                select: {
                    id_usuario: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true,
                            username: true
                        }
                    }
                }
            },
            watchersporincidencia: {
                select: {
                    id_usuario: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true,
                            username: true
                        }
                    }
                }
            },
            timeline: {
                select: {
                    fecha: true,
                    descripcion: true,
                    prevstatus: true,
                    newstatus: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true
                        }
                    }
                }
            }
        }
    });

    return incidencia ? incidencia as IncidenciaLite : null;
}


const getIncidenciasService = async (): Promise<IncidenciaLite[]> => {
    const incidencias = await prisma.incidencias.findMany({
        select: {
            id_incidencias: true,
            nombre: true,
            descripcion: true,
            fecha_creacion: true,
            prioridad: {
                select: {
                    id_prioridad: true,
                    nombre: true,
                    color: true
                }
            },
            status: {
                select: {
                    id_status: true,
                    nombre: true
                }
            },
            usuarios: {
                select: {
                    id_usuario: true,
                    nombrecompleto: true,
                    username: true,
                    correo: true
                }
            },
            respondersporincidencia: {
                select: {
                    id_usuario: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true,
                            username: true
                        }
                    }
                }
            },
            watchersporincidencia: {
                select: {
                    id_usuario: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true,
                            username: true
                        }
                    }
                }
            },
            timeline: {
                select: {
                    fecha: true,
                    descripcion: true,
                    prevstatus: true,
                    newstatus: true,
                    usuarios: {
                        select: {
                            nombrecompleto: true
                        }
                    }
                }
            }
        }
    });

    return incidencias as IncidenciaLite[];
};

const crearIncidenciaService = async (data: incidenciaDTO) => {

    const { id_usuario, nombre, descripcion, id_status, id_prioridad, responders, watchers } = data;

    const existe = await prisma.incidencias.findFirst({
        where: { nombre: nombre }
    });

    if (existe) {
        throw new Error("Ya existe una incidencia con ese nombre");
    }

    if (!id_usuario || !id_status || !id_prioridad) {
        throw new Error("Faltan campos obligatorios");
    }

    const incidencia = await prisma.incidencias.create({
        data: {
            id_usuario: id_usuario || "",
            nombre,
            descripcion,
            id_status: id_status || "",
            id_prioridad: id_prioridad || "",
        }
    });

    if (responders && responders.length > 0) {
        await prisma.respondersporincidencia.createMany({
            data: responders.map(id_usuario => ({
                id_usuario,
                id_incidencia: incidencia.id_incidencias
            })),
            skipDuplicates: true
        });
    }

    if (watchers && watchers.length > 0) {
        await prisma.watchersporincidencia.createMany({
            data: watchers.map(id_usuario => ({
                id_usuario,
                id_incidencia: incidencia.id_incidencias
            })),
            skipDuplicates: true
        });
    }

    await prisma.timeline.create({
        data: {
            id_incidencia: incidencia.id_incidencias || "",
            id_usuario: id_usuario || "",
            descripcion: descripcion ?? "Creación de incidencia",
            newstatus: id_status,
            prevstatus: null
        }
    });

    return incidencia;
}

const editarIncidenciaService = async (data: incidenciaDTO) => {
    const { id_incidencias, id_usuario, nombre, descripcion, id_status, id_prioridad, responders, watchers } = data;

    const incidenciaExistente = await prisma.incidencias.findUnique({
        where: { id_incidencias },
        select: {
            id_status: true,
            id_prioridad: true,
        }
    });

    if (!incidenciaExistente) {
        throw new Error("Incidencia no encontrada");
    }

    const updatedIncidencia = await prisma.incidencias.update({
        where: { id_incidencias },
        data: {
            nombre,
            descripcion,
            id_status,
            id_prioridad,
        }
    });

    if (id_status && id_status !== incidenciaExistente.id_status) {
        cambios.prevstatus = incidenciaExistente.id_status;
        cambios.newstatus = id_status;
    }

    if (id_prioridad && id_prioridad !== incidenciaExistente.id_prioridad) {
        cambios.prevprioridad = incidenciaExistente.id_prioridad;
        cambios.newprioridad = id_prioridad;
    }

    if (cambios.prevstatus || cambios.newstatus || cambios.prevprioridad || cambios.newprioridad) {
        await prisma.timeline.create({
            data: {
                id_incidencia: id_incidencias || "",
                id_usuario: id_usuario || "",
                descripcion: descripcion ?? "Actualización de incidencia",
                prevstatus: cambios.prevstatus,
                newstatus: cambios.newstatus,
            }
        });
    }

    //Eliminar relaciones existentes
    await prisma.respondersporincidencia.deleteMany({
        where: { id_incidencia: id_incidencias }
    });

    await prisma.watchersporincidencia.deleteMany({
        where: { id_incidencia: id_incidencias }
    });

    //crear nuevas relaciones
    if (responders && responders.length > 0) {
        await prisma.respondersporincidencia.createMany({
            data: responders.map(id_usuario => ({
                id_usuario: id_usuario || "",
                id_incidencia: id_incidencias || ""
            })),
            skipDuplicates: true
        });
    }

    if (watchers && watchers.length > 0) {
        await prisma.watchersporincidencia.createMany({
            data: watchers.map(id_usuario => ({
                id_usuario: id_usuario || "",
                id_incidencia: id_incidencias || ""
            })),
            skipDuplicates: true
        });
    }
    return updatedIncidencia;
}

const eliminarIncidenciaService = async (data: incidenciaDTO): Promise<void> => {
    const { id_incidencias, id_usuario } = data;

    const incidencia = await prisma.incidencias.findUnique({
        where: { id_incidencias }
    });

    if (!incidencia) {
        throw new Error("Incidencia no encontrada");
    }

    await prisma.timeline.create({
        data: {
            id_incidencia: incidencia.id_incidencias || "",
            id_usuario: id_usuario || "",
            descripcion: "Incidencia eliminada",
            newstatus: null,
            prevstatus: null
        }
    });

    //Eliminar relaciones existentes
    await prisma.respondersporincidencia.deleteMany({
        where: { id_incidencia: id_incidencias }
    });

    await prisma.watchersporincidencia.deleteMany({
        where: { id_incidencia: id_incidencias }
    });

    //Eliminar incidencia
    await prisma.incidencias.delete({
        where: { id_incidencias }
    });


}

export {
    getIncidenciaService,
    getIncidenciasService,
    crearIncidenciaService,
    editarIncidenciaService,
    eliminarIncidenciaService
};