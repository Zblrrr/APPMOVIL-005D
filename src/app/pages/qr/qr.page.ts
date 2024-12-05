import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { SubjectsService } from 'src/app/services/subjects.service';
import { StorageService } from 'src/app/services/storage.service';
import { Subject } from 'src/app/models/subject';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  scanResult = '';
  user: string | null = null;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private subjectsService: SubjectsService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.platform.is('capacitor')) {
      const permissions = await BarcodeScanner.checkPermissions();
      if (!permissions.camera) {
        await BarcodeScanner.requestPermissions();
      }
      BarcodeScanner.removeAllListeners();
    }

    // Obtener usuario logueado
    this.user = await this.storageService.get('loggedInUser');
  }

  async startScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [], // Formatos permitidos
        LensFacing: LensFacing.Back, // Cámara trasera
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.barcode?.displayValue) {
      this.scanResult = data.barcode.displayValue;
      this.processScanResult(this.scanResult);
    }
  }
  
  async processScanResult(scanResult: string): Promise<void> {
    if (!this.user) {
      this.showToast('Usuario no logueado.');
      return;
    }
  
    // Validar que el código QR tenga el formato esperado
    if (!scanResult.includes('-')) {
      this.showToast('Formato de código QR no válido.');
      return;
    }
  
    const [className, subjectCode] = scanResult.split('-');
  
    if (!className || !subjectCode) {
      this.showToast('El código QR no contiene los datos esperados.');
      return;
    }
  
    // Buscar la asignatura correspondiente
    const subject = await this.subjectsService.getSubjectByCode(subjectCode);
    if (!subject) {
      this.showToast(`No se encontró la asignatura con el código ${subjectCode}`);
      return;
    }
  
    // Inicializar la asistencia del usuario si no existe
    if (!subject.attendance[this.user]) {
      subject.attendance[this.user] = [];
    }
  
    // Buscar la clase en la lista de asistencia del usuario
    const attendanceEntry = subject.attendance[this.user].find(
      (att) => att.class === className
    );
  
    // Si no existe la clase, agregarla
    if (!attendanceEntry) {
      subject.attendance[this.user].push({ class: className, present: true });
      await this.storageService.set('subjects', await this.subjectsService.getSubjects());
      this.showToast(`Asistencia registrada para ${className} en ${subject.name}`);
      return;
    }
  
    // Registrar la asistencia si aún no ha sido marcada
    if (!attendanceEntry.present) {
      attendanceEntry.present = true;
      await this.storageService.set('subjects', await this.subjectsService.getSubjects());
      this.showToast(`Asistencia registrada para ${className} en ${subject.name}`);
    } else {
      this.showToast(`Ya se registró asistencia para ${className}`);
    }
  }
  

  async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
