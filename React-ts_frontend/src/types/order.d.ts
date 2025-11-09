// src/types/order.d.ts
export interface WorkpieceDto {
  id: string;
  state: string;
  typeName: string;
  addedBy: string;
}

export interface OrderDto {
  id: string;
  status: string;
  requestedBy: string;
  createdAt: string;
  workpieces: WorkpieceDto[];
  orderType: string;
}

export interface CreateProductionOrderRequest {
  factoryId: string;
  requestedBy: string;
  workpieceIds: string[];
}

export interface ModifyWorkpiecesRequest {
  orderId: string;
  workpieceIds: string[];
}
