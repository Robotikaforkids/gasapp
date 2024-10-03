import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public database: AngularFirestore
  ) { }

  // Crear documento
  createDoc(data: any, path: string, id: string): Promise<void> {
    return this.database.collection(path).doc(id).set(data);
  }

  // Obtener documento por ID
  getDoc<T>(path: string, id: string): Observable<T | undefined> {
    return this.database.collection<T>(path).doc(id).valueChanges();
  }

  // Eliminar documento
  deleteDoc(path: string, id: string): Promise<void> {
    return this.database.collection(path).doc(id).delete();
  }

  // Actualizar documento
  updateDoc(data: any, path: string, id: string): Promise<void> {
    return this.database.collection(path).doc(id).update(data);
  }

  // Generar ID único
  getId(): string {
    return this.database.createId();
  }

  // Obtener colección completa
  getCollection<T>(path: string): Observable<T[]> {
    return this.database.collection<T>(path).valueChanges();
  }

  // Obtener colección con una consulta
  getCollectionQuery<T>(path: string, parametro: string, condicion: string, busqueda: any): Observable<T[]> {
    return this.database.collection<T>(path, ref => ref.where(parametro, condicion as any, busqueda)).valueChanges();
  }

  // Obtener colección con paginación avanzada y consulta
  getCollectionAll<T>(collectionName: string, parametro: string, condicion: string, busqueda: any, startAt: any = new Date()): Observable<T[]> {
    return this.database.collectionGroup<T>(collectionName, ref =>
      ref.where(parametro, condicion as any, busqueda)
         .orderBy('fecha', 'desc')
         .limit(1)
         .startAfter(startAt)
    ).valueChanges();
  }

  // Obtener colección paginada
  getCollectionPaginada<T>(path: string, limit: number, startAt: any = new Date()): Observable<T[]> {
    return this.database.collection<T>(path, ref => 
      ref.orderBy('fecha', 'desc')
         .limit(limit)
         .startAfter(startAt)
    ).valueChanges();
  }
}
