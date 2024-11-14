import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-detalle-asignatura',
  templateUrl: './detalle-asignatura.page.html',
  styleUrls: ['./detalle-asignatura.page.scss'],
})
export class DetalleAsignaturaPage implements OnInit {
  subject: any;
  attendance: any[] = [];
  user: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) { }

  async ngOnInit() {
    // Obtener detalles de la asignatura desde la ruta
    const subjectCode = this.route.snapshot.paramMap.get('code');
    this.user = await this.storageService.get('loggedInUser');

    if (this.user && subjectCode) {
      this.subject = { code: subjectCode };
      // Cargar asistencia almacenada
      const attendanceKey = `${this.user}_${subjectCode}_attendance`;
      const savedAttendance = await this.storageService.get(attendanceKey);
      this.attendance = savedAttendance || this.generateInitialAttendance();
    }
  }

  generateInitialAttendance() {
    // Generar lista de asistencia por defecto
    return Array(10).fill(0).map((_, i) => ({
      class: `Clase ${i + 1}`,
      present: false
    }));
  }
}
