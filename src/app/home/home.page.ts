import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { NotificationsService } from '../services/notifications.service';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private path = 'Productos/';

  productos: Producto[] = [];
  constructor(
    public menucontroler: MenuController,
    public firestoreService: FirestoreService,
    public notificationsService: NotificationsService) 
     {}

     ngOnInit() {}

     openMenu() {
       console.log('open menu');
       this.menucontroler.toggle('principal');
     }
   
     loadProductos() {
         this.firestoreService.getCollection<Producto>(this.path).subscribe( res => {
               // console.log(res);
               this.productos = res!;
         });
     }
   
     sendNotification() {
         this.notificationsService.newNotication();
     }
   

  }


