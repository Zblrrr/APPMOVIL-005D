import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Subject } from 'src/app/models/subject';

@Component({
  selector: 'app-detalle-asignatura',
  templateUrl: './detalle-asignatura.page.html',
  styleUrls: ['./detalle-asignatura.page.scss'],
})
export class DetalleAsignaturaPage implements OnInit {
  subject: Subject | null = null; // Inicializamos como null para manejar estados de carga
  attendance: { class: string; present: boolean }[] = []; // Lista de asistencia
  user: string | null = null; // Usuario autenticado

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) { }

  async ngOnInit() {
    // Obtener detalles de la asignatura desde la ruta
    const subjectCode = this.route.snapshot.paramMap.get('code');
    this.user = await this.storageService.get('loggedInUser');

    if (this.user && subjectCode) {
      const subjects = await this.storageService.get('subjects') || [];
      this.subject = subjects.find((s: any) => s.code === subjectCode) || { code: subjectCode, name: 'Asignatura desconocida' };

      // Cargar asistencia almacenada
      const attendanceKey = `${this.user}_${subjectCode}_attendance`;
      const savedAttendance = await this.storageService.get(attendanceKey);
      this.attendance = savedAttendance || this.generateInitialAttendance();
    }
  }

  // Generar lista de asistencia inicial
  generateInitialAttendance() {
    return Array(10).fill(0).map((_, i) => ({
      class: `Clase ${i + 1}`,
      present: false
    }));
  }

  // Método para actualizar la asistencia y guardarla en el almacenamiento
  async toggleAttendance(index: number) {
    this.attendance[index].present = !this.attendance[index].present;

    if (this.user && this.subject?.code) {
      const attendanceKey = `${this.user}_${this.subject.code}_attendance`;
      await this.storageService.set(attendanceKey, this.attendance);
    }
  }

  // Getter para calcular el porcentaje de asistencia
  get attendancePercentage(): number {
    const totalClasses = this.attendance.length;
    const attendedClasses = this.attendance.filter(a => a.present).length;
    return totalClasses ? (attendedClasses / totalClasses) * 100 : 0;
  }
}
