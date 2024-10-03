import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { catchError, finalize, from, Observable, of, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(
    public storage: AngularFireStorage,
    public firestore: AngularFirestore  ) { }

    
 
 // Método para subir la imagen y obtener la URL
 uploadImage(file: any, path: string, nombre: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = `${path}/${nombre}`; // Define la ruta
    const fileRef = this.storage.ref(filePath); // Referencia en Firebase Storage
    const task = this.storage.upload(filePath, file); // Inicia la tarea de subida

    // Escucha cuando la tarea de subida se completa
    task.snapshotChanges().pipe(
      finalize(async () => {
        try {
          const downloadURL = await fileRef.getDownloadURL().toPromise(); // Obtén la URL de descarga
          resolve(downloadURL); // Resolver la promesa con la URL
        } catch (error) {
          console.error('Error al obtener la URL de descarga:', error);
          reject(null); // Si hay un error, rechazar la promesa
        }
      })
    ).subscribe();
  });
}
}