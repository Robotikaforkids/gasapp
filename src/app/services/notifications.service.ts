import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import {
  PushNotifications,
  PushNotificationToken,
  PushNotificationActionPerformed,
  PushNotification
} from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public platform: Platform,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              private router: Router,
              private http: HttpClient) {

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
      PushNotifications.requestPermissions().then(result => {
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

  newNotication() {

      const receptor = 'CHpQBloQ36ZRsLoGz9RmUwBAstR2'
      const path = 'Clientes/';
      this.firestoreService.getDoc<any>(path, receptor).subscribe( res => {
            if (res) {
                const token = res.token;
                const dataNotification = {
                  enlace: '/mis-pedidos',
                }
                const notification = {
                  title: 'Mensaje enviado manuelmente',
                  body: 'Adios'
                };
                const msg: INotification = {
                      data: dataNotification,
                      tokens: [token],
                      notification,
                }
                const url = 'https://us-central1-gasdomi.cloudfunctions.net/newNotification';
                return this.http.post<Res>(url, {msg}).subscribe( res => {
                      console.log('respuesta newNotication() -> ', res);
                      
                });
            }

      });


  }



}

interface INotification {
  data: any;
  tokens: string[];
  notification: any
}


interface Res {
  respuesta: string;
}




// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

// const firestore = admin.firestore();
// const uidAdmin = 'CHpQBloQ36ZRsLoGz9RmUwBAstR2';

// const cors = require('cors')({
//     origin: true,
// });

// exports.newPedido = functions.firestore
//     .document('/Clientes/{userId}/pedidos/{pedidoId}')
//     .onCreate( async (event) => {

//         const pedido = event.data();

//         const dataFcm = {
//             enlace: '/pedidos',
//         }

//         const path = '/Clientes/' + uidAdmin;
//         const docInfo = await  firestore.doc(path).get();
//         const dataUser = docInfo.data() as any;
//         const token = dataUser.token;
//         const registrationTokens = [token];

//         const notification: INotification = {
//             data: dataFcm,
//             tokens: registrationTokens,
//             notification: {
//                 title: pedido.cliente.nombre,
//                 body: 'nuevo pedido',
//             },
//         }

//         return sendNotification(notification);
   
        

//     });

// exports.eventPedido = functions.firestore
//     .document('/Clientes/{userId}/pedidos/{pedidoId}')
//     .onUpdate( async (event, eventContext) => {

//         const userUid = eventContext.params.userId;
//         const pedido = event.after.data()

//         const dataFcm = {
//             enlace: '/mis-pedidos',
//         }

//         const path = '/Clientes/' + userUid;
//         const docInfo = await  firestore.doc(path).get();
//         const dataUser = docInfo.data() as any;
//         const token = dataUser.token;
//         const registrationTokens = [token];

//         const notification: INotification = {
//             data: dataFcm,
//             tokens: registrationTokens,
//             notification: {
//                 title: 'Seguimiento de tu pedido',
//                 body: 'Pedido ' +  pedido.estado,
//             },
//         }

//         return  sendNotification(notification);
   
        

//     });


// const sendNotification = (notification: INotification) => {

//         return new Promise((resolve) => {

//             const message: admin.messaging.MulticastMessage = {
//                 data: notification.data,
//                 tokens: notification.tokens,
//                 notification: notification.notification,
//                 android: {
//                     notification: {
//                         icon: 'ic_stat_name',
//                         color: '#EB9234',
//                     } 
//                 },
//                 apns: {
//                     payload: {
//                         aps: {
//                             sound: {
//                                 critical: true,
//                                 name: 'default',
//                                 volume: 1,
//                             }
//                         }
//                     }
//                 }
            
//             }
//             console.log('List of tokens send', notification.tokens);
            
//             admin.messaging().sendMulticast(message)
//             .then((response) => {
//                 if (response.failureCount > 0) {
//                     const failedTokens: any[] = [];
//                     response.responses.forEach((resp, idx) => {
//                         if (!resp.success) {
//                         failedTokens.push(notification.tokens[idx]);
//                         }
//                     });
//                     console.log('List of tokens that caused failures: ' + failedTokens);
//                     // elimnar tokens 
//                 } else {
//                     console.log('Send notification exitoso -> ')
//                 }
//                 resolve(true);
//                 return;
//             }).catch( error => {
//                console.log('Send fcm falló -> ', error)
//                resolve(false);
//                return;
//             }); 
  
//         });
     
// } 

// export const newNotification = functions.https.onRequest((request, response) => {

//     return cors(request, response, async () => {

//         if(request.body.data) {    
//             const notification = request.body.data as INotification;
//             await sendNotification(notification)
//             const res = {
//                 respuesta: 'success'
//             };
//             response.status(200).send(res);    
//         } else {
//             const res = {
//                 respuesta: 'error'
//             };
//             response.status(200).send(res);
//         }
//     });
// });


// // // Start writing Firebase Functions
// // // https://firebase.google.com/docs/functions/typescript
// //
// // export const helloWorld = functions.https.onRequest((request, response) => {
// //   functions.logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


// interface INotification {
//     data: any;
//     tokens: string[];
//     notification: admin.messaging.Notification;
// }

