import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly LOGGED_IN_USER_KEY = 'loggedInUser';

  constructor(
    private storageService: StorageService
  ) { 
    this.initializeUsers();
  }

  private async initializeUsers() {
    const existingUsers = await this.storageService.get('users');
    if (!existingUsers) {
      const initialUsers: User[] = [
        new User('admin', '123'),
        new User('felipe', '1234')
      ];
      await this.storageService.set('users', initialUsers); // Guardar usuarios iniciales
    }
  }

  async validateLogin(u: string, p: string): Promise<boolean> {
    const users = await this.storageService.get('users') as User[];
    const found = users?.find(user => user.usuario === u);
    if (found && found.contrasenia === p) {
      await this.storageService.set(this.LOGGED_IN_USER_KEY, u);
      return true;
    }
    return false;
  }

  // Método para obtener el nombre del usuario autenticado desde el storage
  async getUsuario(): Promise<string | null> {
    return await this.storageService.get(this.LOGGED_IN_USER_KEY); // Obtener usuario autenticado desde el storage
  }

  // Método para cerrar sesión (elimina el usuario del storage)
  async logout(): Promise<void> {
    await this.storageService.remove(this.LOGGED_IN_USER_KEY); // Elimina el usuario del storage
  }

  // Método para obtener los usuarios (en este caso estático)
  async getUsers(): Promise<User[]> {
    const users = await this.storageService.get('users') as User[]; 
    return users || []; 
  }
}
