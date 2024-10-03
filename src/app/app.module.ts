import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Importa HttpClientModule
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { GooglemapsComponent } from './components/googlemaps/googlemaps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './modules/shared/shared.module';
import { SetproductosComponent } from './backend/setproductos/setproductos.component';
@NgModule({
  declarations: [
    AppComponent,
   // ProductoComponent,
    ComentariosComponent,
    ComentariosComponent,
    GooglemapsComponent,
    SetproductosComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule  

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
