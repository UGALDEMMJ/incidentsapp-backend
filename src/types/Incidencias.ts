import { Prioridad } from './Prioridad';
import { Status } from './Status';
import { Usuarios } from './Usuarios';
import { RespondersPorIncidencia } from './RespondersPorIncidencia';
import { WatchersPorIncidencia } from './WatchersPorIncidencia';
import { Timeline } from './Timeline';

export type Incidencias = {
    id_incidencias: string;
    id_usuario: string;
    nombre: string | null;
    descripcion: string | null;
    fecha_creacion: Date | null;
    id_status: string;
    id_prioridad: string;
    prioridad?: Prioridad;
    status?: Status;
    usuarios?: Usuarios;
    respondersporincidencia?: RespondersPorIncidencia;
    watchersporincidencia?: WatchersPorIncidencia;
    timeline?: Timeline[];
}

export type IncidenciaLite = {
  id_incidencias: string;
  nombre: string | null;
  descripcion: string | null;
  fecha_creacion: Date | null;
  prioridad?: {
    id_prioridad: string;
    nombre: string | null;
    color: string | null;
  };
  status?: {
    id_status: string;
    nombre: string | null;
  };
  usuarios?: {
    id_usuario: string;
    nombrecompleto: string;
    username: string;
    correo: string;
  };
  respondersporincidencia: {
    id_usuario: string;
    usuarios: {
      nombrecompleto: string;
      username: string;
    };
  }[];
  watchersporincidencia: {
    id_usuario: string;
    usuarios: {
      nombrecompleto: string;
      username: string;
    };
  }[];
  timeline: {
    fecha: Date;
    descripcion: string | null;
    prevstatus: string | null;
    newstatus: string | null;
    usuarios: {
      nombrecompleto: string;
    };
  }[];
};

export type incidenciaDTO = {
    id_incidencias?: string;
    id_usuario?: string;
    nombre?: string;
    descripcion?: string;
    id_status?: string;
    id_prioridad?: string;
    responders?: string[];
    watchers?: string[];
}