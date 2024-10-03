import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MispedidosPageRoutingModule } from './mispedidos-routing.module';

import { MispedidosPage } from './mispedidos.page';
import { ProductoComponent } from 'src/app/components/producto/producto.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MispedidosPageRoutingModule,
    SharedModule  // Asegúrate de importar SharedModule aquí

  ],
  declarations: [MispedidosPage, ProductoComponent]
})
export class MispedidosPageModule {}
