import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemcarritoComponent } from 'src/app/components/itemcarrito/itemcarrito.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Asegúrate de importar IonicModule
import { ProductoComponent } from 'src/app/components/producto/producto.component';

@NgModule({
  declarations: [
    ItemcarritoComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports:[
    ItemcarritoComponent,
    IonicModule, // Exporta también IonicModule si otros módulos lo necesitan
    
  ]
})
export class SharedModule { }
