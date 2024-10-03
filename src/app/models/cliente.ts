export interface Cliente {
    uid: string;
    email: string;
    nombre: string;
    celular: string;
    foto: string;
    referencia: string;
    ubicacion: {
        lat: number;
        lng: number;
    }
}
