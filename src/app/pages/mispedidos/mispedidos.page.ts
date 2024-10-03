import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.page.html',
  styleUrls: ['./mispedidos.page.scss'],
})
export class MispedidosPage implements OnInit {

  nuevosSuscriber!: Subscription;
  culmidadosSuscriber!: Subscription;
  pedidos: Pedido[] = [];

  constructor(
    public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
      this.getPedidosNuevos();
  }

  ngOnDestroy() {
     if (this.nuevosSuscriber) {
        this.nuevosSuscriber.unsubscribe();
     }
     if (this.culmidadosSuscriber) {
        this.culmidadosSuscriber.unsubscribe();
     }
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //  console.log('changeSegment()', ev.detail.value);
     const opc = ev.detail.value;
     if (opc === 'culminados') {
       this.getPedidosCulminados();
     }
     if (opc === 'nuevos') {
          this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe( res => {
          if (res.length) {
                console.log('getPedidosNuevos() -> res ', res);
                this.pedidos = res;
          }
    });

  }

  async getPedidosCulminados() {
    console.log('getPedidosCulminados()');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.culmidadosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe( res => {
          if (res.length) {
                console.log('getPedidosCulminados() -> res ', res);
                this.pedidos = res;
          }
    });

  }


}
