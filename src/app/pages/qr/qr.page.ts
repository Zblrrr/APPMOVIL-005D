import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  user: string | null = null;

  constructor(
    private alertController: AlertController,
    private storageService: StorageService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    // Verificar si el escáner es soportado en el dispositivo
    const result = await BarcodeScanner.isSupported();
    console.log('Barcode scanning supported:', result.supported);
    this.isSupported = result.supported;

    // Obtener el usuario logueado para almacenar el escaneo bajo su ID
    this.user = await this.storageService.get('loggedInUser');
  }

  async scan(): Promise<void> {
    // Solicitar permisos de cámara
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert('Permiso denegado', 'Por favor otorga permisos de cámara para usar el escáner.');
      return;
    }

    try {
      // Realizar el escaneo de código QR
      const { barcodes } = await BarcodeScanner.scan(); 
      
      if (barcodes.length > 0) {
        // Usar `rawValue` o el nombre correcto de la propiedad del contenido
        const barcodeContent = barcodes[0].rawValue || barcodes[0].displayValue;
        
        if (barcodeContent) {
          // Asumimos que el contenido del QR es "Clase X-CODIGO"
          const [className, subjectCode] = barcodeContent.split('-');
          
          // Guardar el escaneo en StorageService para que lo use la página de detalle de asignatura
          await this.storageService.set(`${this.user}_lastScan`, { className, subjectCode });
          
          // Mostrar alerta de éxito y navegar a la lista de asignaturas
          this.presentAlert('Escaneo exitoso', `Clase: ${className}, Código: ${subjectCode}`);
          this.navController.navigateBack('/asignaturas');
        } else {
          this.presentAlert('Código no válido', 'El código escaneado no contiene datos.');
        }
      }
    } catch (error) {
      console.error('Error al escanear el código de barras:', error);
      this.presentAlert('Error', 'No se pudo escanear el código.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    // Solicitar permisos de cámara
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}