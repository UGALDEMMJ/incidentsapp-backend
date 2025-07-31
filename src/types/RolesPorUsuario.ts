import { Rol } from "./Rol";
import { Usuarios } from "./Usuarios";

export type RolesPorUsuario = {
    id_rol: string;
    id_usuario: string;
    rol: Rol;
    usuario: Usuarios;
}
