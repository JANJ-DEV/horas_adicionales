import type { Timestamp } from "firebase/firestore";
import type { ReactNode } from "react";

/**
 * Props base para componentes que reciben contenido hijo.
 */
export type Children = {
  children: ReactNode;
};
/**
 * Puesto de trabajo asociado a una rama/sector en datos operativos.
 */
export interface JobPosition {
  id: string;
  description: string;
  name: string;
}

/**
 * Documento de perfil de puesto manejado en Firestore.
 */
export interface JobProfile {
  id?: string;
  title: string;
  branch: MakeOptional<Branch, "jobsPositions">;
  jobPosition: JobPosition;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Ítem de puesto dentro del catálogo de sectores.
 */
export interface JobCatalogItem {
  id: string;
  name: string;
  description: string;
}
/**
 * Proyección parcial de documento de puesto para formularios/edición.
 * Incluye claves en inglés y español por compatibilidad.
 */
export type JobPositionDoc = {
  id?: string;
  name?: string;
  description?: string;
  nombre?: string;
  descripcion?: string;
};

/**
 * Sector del catálogo maestro de puestos.
 */
export interface SectorCatalog {
  id: string;
  name: string;
  description: string;
  jobsPositions: JobCatalogItem[];
}

/**
 * Estructura raíz para el JSON del catálogo maestro.
 */
export interface SectorsCatalogRoot {
  sectores_y_puestos: SectorCatalog[];
}

/**
 * Estructura de una rama con sus puestos de trabajo.
 */
export interface Branch {
  id: string;
  name: string;
  description: string;
  jobsPositions?: JobPosition[];
}

/**
 * Proyección parcial de documento de rama para formularios/edición.
 */
export type BranchDoc = {
  id?: string;
  name?: string;
  description?: string;
  sector?: string;
  descripcion_sector?: string;
};

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;