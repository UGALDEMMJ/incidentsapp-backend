import { Prioridad } from './Prioridad';
import { Status } from './Status';
import { Usuarios } from './Usuarios';
import { RespondersPorIncidencia } from './RespondersPorIncidencia';
import { WatchersPorIncidencia } from './WatchersPorIncidencia';
import { Timeline } from './Timeline';

export type Incidencias = {
    id_incidencias: string;
    id_usuario: string;
    nombre: string;
    descripcion: string;
    fecha_creacion: Date;
    id_status: string;
    id_prioridad: string;
    prioridad: Prioridad;
    status: Status;
    usuarios: Usuarios;
    responders: RespondersPorIncidencia;
    watchers: WatchersPorIncidencia;
    timeline: Timeline[];
}