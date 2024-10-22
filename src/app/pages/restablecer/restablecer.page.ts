import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {

  usuario: string = '';
  nuevaContrasenia: string = '';
  repetirContrasenia: string = '';
  userValid: boolean = false;

  @ViewChild('nuevaContraseniaInput', { read: ElementRef }) nuevaContraseniaInput!: ElementRef;
  @ViewChild('repetirContraseniaInput', { read: ElementRef }) repetirContraseniaInput!: ElementRef;
  @ViewChild('resetButton', { read: ElementRef }) resetButton!: ElementRef;

  constructor(
    private storageService: StorageService,
    private alertController: AlertController,
    private animationController: AnimationController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async validateUser() {
    const users = await this.storageService.get('users');
    if (users) {
      const found = users.find((user: any) => user.usuario === this.usuario);
      if (found) {
        this.userValid = true;
        this.showAlert('Usuario válido', 'Puedes proceder a cambiar tu contraseña.');
      } else {
        this.userValid = false;
        this.showAlert('Usuario no encontrado', 'El nombre de usuario no es válido.');
      }
    } else {
      this.showAlert('Error', 'No se han encontrado usuarios.');
    }
  }

  async resetPassword() {
    // Verificar si las contraseñas coinciden y si tienen al menos 3 caracteres
    if (this.nuevaContrasenia.length >= 3 && this.repetirContrasenia.length >= 3) {
      if (this.nuevaContrasenia === this.repetirContrasenia) {
        const users = await this.storageService.get('users');
        if (users) {
          const userIndex = users.findIndex((user: any) => user.usuario === this.usuario);
          if (userIndex > -1) {
            // Actualiza la contraseña
            users[userIndex].contrasenia = this.nuevaContrasenia;
            await this.storageService.set('users', users);
            this.showAlert('Contraseña actualizada', 'Tu contraseña ha sido restablecida correctamente.')
              .then(() => {
                // Redirigir a la página 'home' después de restablecer la contraseña
                this.router.navigate(['/home']);
              });

            // Resetear los campos
            this.userValid = false;
            this.usuario = '';
            this.nuevaContrasenia = '';
            this.repetirContrasenia = '';
          }
        }
      } else {
        this.showAlert('Error', 'Las contraseñas no coinciden.');
      }
    } else {
      this.showAlert('Error', 'La contraseña debe tener al menos 3 caracteres.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  triggerAnimations() {
    const nuevaContraseniaAnim = this.animationController.create()
      .addElement(this.nuevaContraseniaInput.nativeElement)
      .duration(2000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(-50vh)', 'translateY(0)');

    const repetirContraseniaAnim = this.animationController.create()
      .addElement(this.repetirContraseniaInput.nativeElement)
      .duration(2000)
      .delay(2500)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(-50vh)', 'translateY(0)');

    const resetButtonAnim = this.animationController.create()
      .addElement(this.resetButton.nativeElement)
      .duration(2000)
      .delay(5000)
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(-50vh)', 'translateY(0)');

    nuevaContraseniaAnim.play();
    repetirContraseniaAnim.play();
    resetButtonAnim.play();
  }

}
