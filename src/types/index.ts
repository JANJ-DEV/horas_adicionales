import type { Timestamp } from "firebase/firestore";
import type { ReactNode } from "react";

export type Children = {
  children: ReactNode;
};

export interface JobProfile {
  id?: string;
  profileTitle: string;
  sectorName: string;
  sectorDescription?: string;
  jobPosition: string;
  jobDescription?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface JobCatalogItem {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface SectorCatalog {
  id: string;
  sector: string;
  descripcion_sector: string;
  puestos_de_trabajo: JobCatalogItem[];
}

export interface SectorsCatalogRoot {
  sectores_y_puestos: SectorCatalog[];
}
export interface JobPosition {
  id: string;
  descripcion: string;
  nombre: string;
}
export interface Branch {
  id: string;
  sector: string;
  descripcion_sector: string;
  puestos_de_trabajo: JobPosition[];
}

export type BranchData = {
  id: string;
  data: Branch[];
};
