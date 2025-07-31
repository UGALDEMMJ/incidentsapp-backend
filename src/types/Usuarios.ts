import { Incidencias } from "./Incidencias";
import { Timeline } from "./Timeline";
import { WatchersPorIncidencia } from "./WatchersPorIncidencia";
import { RespondersPorIncidencia } from "./RespondersPorIncidencia";
import { RolesPorUsuario } from "./RolesPorUsuario";

export type Usuarios = {
    id_usuario: string;
    nombreCompleto: string;
    correo: string;
    username: string;
    password: string;
    enable: boolean;
    fecha_registro: Date;  
    ultima_actualizacion: Date;
    incidencias: Incidencias[];
    respondersPorIncidencia: RespondersPorIncidencia[];
    rolesPorUsuario: RolesPorUsuario[];
    timeline: Timeline[];
    watchersPorIncidencia: WatchersPorIncidencia[];
}