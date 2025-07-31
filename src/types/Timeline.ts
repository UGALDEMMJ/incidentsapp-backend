import { Incidencias } from "./Incidencias";
import { Usuarios } from "./Usuarios";
import { Status } from "./Status";

export type Timeline = {
    id_timeline: string;
    id_incidencia: string;
    descripcion: string;
    fecha: Date;
    prevstatus: string;
    newstatus: string;
    id_usuario: string;
    incidencia: Incidencias;
    usuario: Usuarios;
    status_timeline_prevstatusTostatus?: Status | null;
    status_timeline_newstatusTostatus?: Status | null;
}
