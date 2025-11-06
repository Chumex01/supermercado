// src/types/compras.ts
export interface Detalle {
  id: number;
  producto_id: number;
  cantidad_solicitada: number;
  justificacion: string;
}

export interface Empleado {
  id: number;
  nombre?: string;
}

export interface Sucursal {
  id: number;
  nombre?: string;
}

export interface Solicitud {
  id: number;
  empleado_solicitante: Empleado;
  sucursal: Sucursal;
  observaciones?: string;
  estado: string;
  fecha_solicitud: string;
  detalles: Detalle[];
}
