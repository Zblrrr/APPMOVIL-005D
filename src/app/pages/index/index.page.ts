import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  usuario!: string | null;
  contrasenia: string = '';

  constructor(
    private router: Router,
    private menu: MenuController,
    private storageService: StorageService,
    private loginService: LoginService,
    private alertController: AlertController,
    private platform: Platform
  ) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/index') {
        App.exitApp();  // Salir de la app si están en el index
      }
    });
  }

  async ngOnInit() {
    // Obtener el usuario almacenado en el Storage
    const loggedIn = this.usuario = await this.storageService.get('loggedInUser');
    if (!loggedIn) {
      this.router.navigate(['/home']);
    }
  }

  openMenu() {
    this.menu.open('end');
  }

  goToQr() {
    this.menu.close();
    this.router.navigate(['/qr']);
  }

  // Confirmación antes de cerrar sesión
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Cerrar sesión',
          handler: () => {
            this.logout(); // Llamar a la función de logout si se confirma
          }
        }
      ]
    });
    await alert.present();
  }

  private async logout() {
    await this.loginService.logout(); 
    this.router.navigate(['/home']);   
    this.menu.close();                  
  }
}

