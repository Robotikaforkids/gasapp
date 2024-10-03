import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { INotification } from '../models/i-notification';
import { Res } from '../models/res';
import { PushNotifications, PushNotificationToken, PushNotification, PushNotificationActionPerformed } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor
    (public platform: Platform,
      public firebaseauthService: FirebaseauthService,
      public firestoreService: FirestoreService,
      private router: Router,
      private http: HttpClient
  ) { 

    this.stateUser();

  }

  stateUser() {
    this.firebaseauthService.stateAuth().subscribe( res => {
      console.log(res);
      if (res !== null) {
          this.inicializar();
      }  
    });

  }            
  inicializar() {
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then((result: { receive: string; }) => {
        if (result.receive === 'granted') {
          PushNotifications.register();
          this.addListeners();
        }
      });
    } else {
      console.log('No es un dispositivo móvil');
    }
  }
  addListeners() {

           PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          console.log('The token is:', token);
          this.guadarToken(token.value);
        }
      );

      PushNotifications.addListener('registrationError',
        (error: any) => {
          console.log('Error on registration', error);
        }
      );

      /// primer plano
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          console.log('Push received en 1er plano: ', notification);

             
        }
      );

      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          console.log('Push action performed en segundo plano -> ', notification);
          
          this.router.navigate([notification.notification.data.enlace]);
        }
      );

    
  }

  async guadarToken(token: any) {

      const Uid = await this.firebaseauthService.getUid();

      if (Uid) {
          console.log('guardar Token Firebase ->', Uid);
          const path = '/Clientes/';
          const userUpdate = {
            token: token,
          };
          this.firestoreService.updateDoc(userUpdate, path, Uid);
          console.log('guardar TokenFirebase()->', userUpdate, path, Uid);
      }
  }

  newNotication(): void {
    const receptor = 'CHpQBloQ36ZRsLoGz9RmUwBAstR2';
    const path = 'Clientes/';
    this.firestoreService.getDoc<any>(path, receptor).subscribe(res => {
      if (res) {
        const token = res.token;
        const dataNotification = {
          enlace: '/mis-pedidos',
        };
        const notification = {
          title: 'Mensaje enviado manualmente',
          body: 'Adios'
        };
        const msg: INotification = {
          data: dataNotification,
          tokens: [token],
          notification,
        };
        const url = 'https://us-central1-gasdomi.cloudfunctions.net/newNotification';
        this.http.post<Res>(url, { msg }).subscribe(res => {
          console.log('respuesta newNotication() -> ', res);
        });
      } else {
        console.log('No se encontró el receptor');
      }
    });
  }

  }



