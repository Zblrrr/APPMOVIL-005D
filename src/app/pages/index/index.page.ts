import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  usuario!: string | null;
  contrasenia: string = '';
  climaActual: any;

  constructor(
    private router: Router,
    private menu: MenuController,
    private storageService: StorageService,
    private loginService: LoginService,
    private alertController: AlertController,
    private platform: Platform,
    private weatherService: WeatherService
  ) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/index') {
        App.exitApp();  // Salir de la app si están en el index
      }
    });
  }

  async ngOnInit() {
    try {
      // Verificar si el usuario está logueado
      const loggedIn = this.usuario = await this.storageService.get('loggedInUser');
      if (!loggedIn) {
        this.router.navigate(['/home']);
      }
  
      // Solicitar y verificar los permisos de geolocalización
      await this.weatherService.verificarPermisosUbicacion();
      
      // Obtener el clima actual
      this.climaActual = await this.weatherService.obtenerClimaActual();
    } catch (error) {
      console.error('Error al iniciar el componente:', error);
    }
  }

  openMenu() {
    this.menu.open('end');
  }

  goToQr() {
    this.menu.close();
    this.router.navigate(['/qr']);
  }

  goToAsignaturas() {
    this.menu.close();
    this.router.navigate(['/asignaturas']);
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

