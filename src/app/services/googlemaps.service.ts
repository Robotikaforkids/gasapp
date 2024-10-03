import { Injectable, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {
  apiKey = environment.ApiKeyGoogleMaps;
  mapsLoaded = false;


  constructor() {}

  init(renderer: Renderer2, document: Document): Promise<boolean> {
    return new Promise((resolve, reject) => {

      // Si el script ya fue cargado, resolvemos la promesa
      if (this.mapsLoaded) {
        console.log('Google Maps ya ha sido cargado');
        resolve(true);
        return;
      }

      // Crear el script de Google Maps
      const script = renderer.createElement('script');
      script.id = 'googleMaps';

      // Asignar la función de inicialización para cuando el script esté cargado
      window['mapInit'] = () => {
        this.mapsLoaded = true;
        if (typeof google !== 'undefined' && google.maps) {
          console.log('Google Maps ha sido cargado');
        } else {
          console.error('Google Maps no está definido');
          reject(false);
        }
        resolve(true);
      };

      // Añadir el src con o sin la API key
      if (this.apiKey) {
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=mapInit`;
      } else {
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
      }

      // Manejo de errores en la carga del script
      script.onerror = () => {
        console.error('Error al cargar el script de Google Maps');
        reject(false);
      };

      // Añadir el script al DOM
      renderer.appendChild(document.body, script);
    });
  }

}
