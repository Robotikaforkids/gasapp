export interface Window {
    mapInit: () => void;
}

declare global {
    interface Window {
      mapInit: () => void;
    }

    // Declarar la variable global google
 // var google: any;
  }
