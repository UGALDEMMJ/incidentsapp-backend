import { RolesPorUsuario } from "./RolesPorUsuario";

export type Rol = {
    id_rol: string;
    nombre?: string | null;
    descripcion?: string | null;
    rolesPorUsuario: RolesPorUsuario[];
}
