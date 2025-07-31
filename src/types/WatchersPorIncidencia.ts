import { Incidencias } from "./Incidencias";
import { Usuarios } from "./Usuarios";

export type WatchersPorIncidencia = {
    id_incidencia: string;
    id_usuario: string;
    incidencias: Incidencias;
    usuarios: Usuarios;
}
