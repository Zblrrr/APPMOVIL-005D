import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { NotFoundComponent } from './components/not-found/not-found.component';


// Función para inicializar el StorageService
export function initApp(storageService: StorageService) {
  return () => storageService.init();
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(), // Inicialización del módulo de almacenamiento
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy, // Manejo de rutas reutilizables
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [StorageService], // Dependencia del servicio de almacenamiento
      multi: true, // Asegura que se ejecute antes de cargar la app
    },
    provideHttpClient(withInterceptorsFromDi()), // Configuración de interceptores HTTP
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}