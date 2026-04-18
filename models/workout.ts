export type Exercise = {
    id: string;
    exerciseId?: string;
    nombre: string;
    grupo: string;
    detalle: string;
    estado?: "Pendiente" | "Completado";
    series: number;
    repeticiones?: number;
    duracionSegundos?: number;
    maquina?: string;
    videoUrl?: string;
    videoKey?: string;
    order?: number;
};

export type Routine = {
    id: string;
    nombre: string;
    ejercicios: Exercise[];
    creador: string;
    participantes: string[];
    descansoSegundos?: number;
};

export type ExerciseCatalogItem = {
    id: string;
    nombre: string;
    grupo: string;
    detalle?: string;
    maquina?: string;
    videoUrl?: string;
    videoKey?: string;
};