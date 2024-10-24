import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/storage.service';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storageService: StorageService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Inicializar el servicio de almacenamiento
      await this.storageService.init();

      // Verificar si el usuario está logueado
      const isLoggedIn = await this.loginService.isLoggedIn();

      if (!isLoggedIn) {
        // Si no está logueado, redirigir al login
        this.router.navigate(['/login']);
      } else {
        // Si está logueado, redirigir al índice
        this.router.navigate(['/index']);
      }
    });
  }
}
