import { Incidencias } from "./Incidencias";
import { Timeline } from "./Timeline";
import { WatchersPorIncidencia } from "./WatchersPorIncidencia";
import { RespondersPorIncidencia } from "./RespondersPorIncidencia";
import { RolesPorUsuario } from "./RolesPorUsuario";

export type Usuarios = {
    id_usuario: string;
    nombrecompleto: string;
    correo: string;
    username: string;
    password_hash?: string;
    enable: boolean | null; // Ensure enable is boolean, not null
    fecha_registro: Date | null;  
    incidencias?: Incidencias[];
    respondersporincidencia?: RespondersPorIncidencia[];
    rolesporusuario?: RolesPorUsuario[];
    timeline?: Timeline[];
    watchersporincidencia?: WatchersPorIncidencia[];
}


export const usuarioEmpty: Usuarios = {
    id_usuario: "",
    nombrecompleto: "",
    correo: "",
    username: "",
    enable: false,
    fecha_registro: new Date() || null,
    incidencias: [],
    respondersporincidencia: [],
    rolesporusuario: [],
    timeline: [],
    watchersporincidencia: []
};

export type usuarioDTO = {
    id_usuario?: string;
    nombrecompleto?: string;
    correo?: string;
    username?: string;
    password_hash?: string;
    enable?: boolean | null;
    fecha_registro?: Date | null;
};
