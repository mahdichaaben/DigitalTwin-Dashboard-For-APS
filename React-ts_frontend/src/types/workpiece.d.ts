// src/types/workpiece.d.ts
export interface WorkpieceDto {
  id: string;
  state: string;
  typeName: string;
  addedBy: string;
}

export interface WorkpieceTypeDto {
  id: string;
  name: string;
  color: string;
  moduleNames: string[];
}

// For drag & drop placed modules
export interface PlacedModule {
  serialNumber: string;
  name: string;
  role: string;
}
