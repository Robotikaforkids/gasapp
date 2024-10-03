import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comentario } from 'src/app/models/comentario';
import { Producto } from 'src/app/models/producto';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent  implements OnInit {

  @Input() producto!: Producto;

  comentario = '';

  comentarios: Comentario[] = []; 

  suscriber!: Subscription;
  suscriberUserInfo!: Subscription;

  constructor(public modalController: ModalController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
      console.log('producto', this.producto);
      this.loadCommentarios();
  }

  ngOnDestroy(): void {
        console.log('ngOnDestroy() modal')
        if (this.suscriber) {
           this.suscriber.unsubscribe();
        }
  }

  closeModal() {
      this.modalController.dismiss();
  }

  loadCommentarios() {
    let startAt = null;
    if(this.comentarios.length) {
        startAt = this.comentarios[ this.comentarios.length - 1].fecha;
    }
    const path = 'Productos/' +  this.producto.id + '/comentarios';
    this.suscriber = this.firestoreService.getCollectionPaginada<Comentario>(path, 3, startAt).subscribe( res => {
         if (res.length) {
            res.forEach( (comentario: Comentario) => {
                const exist = this.comentarios.find( commentExist => {
                       commentExist.id === comentario.id   
                });
                if (exist === undefined) {
                  this.comentarios.push(comentario);
                }
            });
            // this.comentarios = res;
            console.log(res);
         }
    } );

  }

  comentar() {
     const comentario = this.comentario;
     console.log('comentario ->' , comentario);
     const path = 'Productos/' +  this.producto.id + '/comentarios';
     const data: Comentario = {
        autor: this.firebaseauthService.datosCliente.nombre,
        comentario: comentario,
        fecha: new Date(),
        id: this.firestoreService.getId()
     }
     this.firestoreService.createDoc(data, path, data.id).then( () => {
         console.log('comentario enviado');
         this.comentario = '';
     });
  }

}