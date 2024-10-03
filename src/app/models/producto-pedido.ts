import { Producto } from "./producto";

export interface ProductoPedido {

    producto: Producto;
    cantidad: number;
}

export type  EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado';

