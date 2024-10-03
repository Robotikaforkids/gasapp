import { Cliente } from "./cliente";
import { EstadoPedido, ProductoPedido } from "./producto-pedido";

export interface Pedido {
    id: string;
    cliente: Cliente;
    productos: ProductoPedido[];
    precioTotal: number;
    estado: EstadoPedido;
    fecha: any;
    valoracion: number;
}
