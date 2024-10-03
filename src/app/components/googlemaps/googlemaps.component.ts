import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2,  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

declare global {
  interface Window {
    mapInit: () => void;
  }
}

var google: any;  // Declarar google globalmente

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent  {

  apiKey = environment.ApiKeyGoogleMaps;
  mapsLoaded = false;

  constructor(
    public modalController: ModalController,
    private renderer: Renderer2,  // Usar Renderer2 en lugar de Renderer

    @Inject(DOCUMENT) private document: Document  // Inyectar el documento
  ) {}

  init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Si los mapas ya han sido cargados
      if (this.mapsLoaded) {
        console.log('Google Maps ya está cargado');
        resolve(true);
        return;
      }

      // Crear el script de Google Maps
      const script = this.renderer.createElement('script');
      script.id = 'googleMaps';

      // Asignar la función mapInit a window
      window['mapInit'] = () => {
        this.mapsLoaded = true;
        if (typeof google !== 'undefined' && google.maps) {
          console.log('Google Maps cargado correctamente');
          resolve(true);
        } else {
          console.error('Error: Google Maps no está definido.');
          reject(false);
        }
      };

      // Añadir el src con o sin la API key
      script.src = this.apiKey
        ? `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=mapInit`
        : 'https://maps.googleapis.com/maps/api/js?callback=mapInit';

      // Manejar el error de carga del script
      script.onerror = () => {
        console.error('Error al cargar el script de Google Maps');
        reject(false);
      };

      // Añadir el script al DOM
      this.renderer.appendChild(this.document.body, script);
    });
  }

   // Método aceptar para ser llamado desde la plantilla
   aceptar() {
    console.log('Aceptar clicado');
    this.modalController.dismiss(); // Puedes usar esto si quieres cerrar el modal
  }

  // Método mylocation para manejar la acción de ubicación
  mylocation() {
    console.log('Ubicación actual seleccionada');
    // Aquí iría la lógica para obtener la ubicación actual
  }

  // Función para cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }

}
