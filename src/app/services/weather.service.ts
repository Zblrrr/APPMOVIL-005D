import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(
    private http:HttpClient,
  ) { }

  // Método para verificar y solicitar permisos de ubicación
  async verificarPermisosUbicacion() {
    // Verificar si el permiso ya ha sido concedido
    const permiso = await Geolocation.checkPermissions();
    if (permiso.location !== 'granted') {
      // Si el permiso no está concedido, solicitarlo
      const nuevoPermiso = await Geolocation.requestPermissions();
      if (nuevoPermiso.location !== 'granted') {
        throw new Error('Permiso de ubicación denegado');
      }
    }
  }

  // Método para obtener la ubicación actual del usuario
  async obtenerUbicacion() {
    try {
      // Primero, verificar y solicitar permisos si es necesario
      await this.verificarPermisosUbicacion();

      // Obtener las coordenadas del dispositivo
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      throw error;
    }
  }

    // Método para obtener el clima actual del usuario
    async obtenerClimaActual() {
      try {
        const ubicacion = await this.obtenerUbicacion();
  
        // Parámetros para la solicitud de clima con "current_weather" para obtener la temperatura actual
        const params = {
          latitude: ubicacion.latitude.toString(),  // Convertir a string
          longitude: ubicacion.longitude.toString(), // Convertir a string
          current_weather: 'true',  // Solicitar el clima actual como string
          timezone: 'auto'  // Auto-detecta la zona horaria basada en la ubicación
        };
  
        // Realizar la solicitud HTTP y obtener la respuesta
        const climaData = await lastValueFrom(this.http.get(this.apiUrl, { params }));
        return climaData;
      } catch (error) {
        console.error('Error obteniendo el clima:', error);
        throw error;
      }
    }
  
}
