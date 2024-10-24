import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate{

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    const loggedInUser = await this.storageService.get('loggedInUser');
    if (loggedInUser) {
      this.router.navigate(['/index']); // Redirigir si ya está logueado
      return false;  // Bloquear acceso a la página de login
    }
    return true;  // Permitir acceso si no hay usuario logueado
  }

}
