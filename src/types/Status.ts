import { Incidencias } from "./Incidencias";
import { Timeline } from "./Timeline";

export type Status = {
    id_status: string;
    nombre: string | null;
    incidencias?: Incidencias[];
    timeline_timeline_newstatusTostatus?: Timeline;
    timeline_timeline_prevstatusTostatus?: Timeline;
}
