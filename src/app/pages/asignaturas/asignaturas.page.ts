import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectsService } from 'src/app/services/subjects.service';
import { Subject } from 'src/app/models/subject';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  subjects: Subject[] = []; // Lista de asignaturas cargadas desde el almacenamiento
  isLoading = true; // Indicador de carga

  constructor(
    private router: Router,
    private subjectsService: SubjectsService
  ) {}

  async ngOnInit() {
    try {
      // Asegurarse de que las asignaturas estén inicializadas
      await this.subjectsService.initializeSubjects();
      this.subjects = await this.subjectsService.getSubjects();
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      this.subjects = [];
    } finally {
      this.isLoading = false; // Ocultar el indicador de carga
    }
  }

  // Contar el número de asignaturas
  get enrolledSubjectsCount(): number {
    return this.subjects.length;
  }

  // Navegar a la página de detalles de la asignatura
  goToDetail(subjectCode: string) {
    this.router.navigate(['/detalle-asignatura', subjectCode]);
  }
}
