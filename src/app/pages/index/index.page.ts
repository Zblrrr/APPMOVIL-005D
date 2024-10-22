import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
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
    private loginService: LoginService
  ) { }

  async ngOnInit() {
    // Obtener el usuario almacenado en el Storage
    this.usuario = await this.storageService.get('loggedInUser');
  }

  openMenu() {
    this.menu.open('end');
  }

  goToQr() {
    this.menu.close();
    this.router.navigate(['/qr']);
  }

  async logout() {
    await this.loginService.logout(); 
    this.usuario = ''; // Reinicia el campo de usuario
    this.contrasenia = ''; // Reinicia el campo de contraseña
    this.router.navigate(['/home']);   
    this.menu.close();                  
  }
}

