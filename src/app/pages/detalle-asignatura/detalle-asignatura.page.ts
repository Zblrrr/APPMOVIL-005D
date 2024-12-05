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
  subject: Subject | null = null; // Detalles de la asignatura
  user: string | null = null; // Usuario autenticado
  attendance: { class: string; present: boolean }[] = []; // Lista de asistencia del usuario logueado

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  async ngOnInit() {
    // Obtener el código de la asignatura desde la ruta
    const subjectCode = this.route.snapshot.paramMap.get('code');
    // Obtener el usuario logueado
    this.user = await this.storageService.get('loggedInUser');

    if (this.user && subjectCode) {
      // Obtener asignaturas del almacenamiento
      const subjects = (await this.storageService.get('subjects')) || [];
      // Encontrar la asignatura específica
      this.subject = subjects.find((s: any) => s.code === subjectCode) || null;

      if (this.subject) {
        // Obtener asistencia del usuario para esta asignatura
        this.attendance = this.subject.attendance[this.user] || this.generateInitialAttendance();
        // Guardar la asistencia inicial si no existe
        if (!this.subject.attendance[this.user]) {
          this.subject.attendance[this.user] = this.attendance;
          await this.saveSubjects(subjects);
        }
      }
    }
  }

  // Generar lista inicial de clases
  generateInitialAttendance(): { class: string; present: boolean }[] {
    return Array(10)
      .fill(0)
      .map((_, i) => ({
        class: `Clase ${i + 1}`,
        present: false,
      }));
  }

  // Alternar estado de asistencia y guardar cambios
  async toggleAttendance(index: number) {
    if (this.user && this.subject) {
      this.attendance[index].present = !this.attendance[index].present;
      this.subject.attendance[this.user] = this.attendance;

      // Guardar los cambios en el almacenamiento
      const subjects = (await this.storageService.get('subjects')) || [];
      const subjectIndex = subjects.findIndex((s: any) => s.code === this.subject!.code);

      if (subjectIndex !== -1) {
        subjects[subjectIndex] = this.subject;
        await this.saveSubjects(subjects);
      }
    }
  }

  // Calcular el porcentaje de asistencia
  get attendancePercentage(): number {
    const totalClasses = this.attendance.length;
    const attendedClasses = this.attendance.filter((a) => a.present).length;
    return totalClasses ? (attendedClasses / totalClasses) * 100 : 0;
  }

  // Guardar todas las asignaturas en el almacenamiento
  private async saveSubjects(subjects: Subject[]): Promise<void> {
    await this.storageService.set('subjects', subjects);
  }
}
