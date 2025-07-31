import { Incidencias } from "./Incidencias";

export type Prioridad = {
    id_prioridad: string;
    nombre?: string | null;
    color?: string | null;
    incidencias?: Incidencias[]; 
}

