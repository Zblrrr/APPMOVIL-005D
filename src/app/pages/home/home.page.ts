import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  usuario!: string;
  contrasenia!: string;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private loginService: LoginService
  ) { }

  // Método de validación de login
  async validateLogin() {
    console.log("Ejecutando validación PAGE!");

    // Validar el login
    const isValidLogin = await this.loginService.validateLogin(this.usuario, this.contrasenia);
    
    if (isValidLogin) {
      this.showToastMessage('Login exitoso', 'success');

      // Navegar a la página "index" y pasar el usuario como NavigationExtras
      const extras: NavigationExtras = {
        state: {
          usuario: this.usuario 
        }
      };
      this.router.navigate(['/index'], extras);
    } else {
      this.showAlertMessage('Datos Incorrectos', 'Usuario y/o contraseña incorrecta');
    }
  }

  async showToastMessage(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      duration: 3000,
      message: mensaje,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  async showAlertMessage(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
