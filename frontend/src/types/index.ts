// src/types/index.ts
export interface DetalleSolicitud {
  id: number;
  producto: { id: number; nombre: string };
  cantidad_solicitada: number;
  justificacion: string;
}

export interface Solicitud {
  id: number;
  empleado_solicitante: { id: number; nombres: string; apellidos: string };
  sucursal: { id: number; nombre: string };
  observaciones?: string;
  estado: string;
  fecha_solicitud: string;
  detalles: DetalleSolicitud[];
}
