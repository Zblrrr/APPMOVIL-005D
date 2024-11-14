import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  subjects = [
    { name: 'Matemáticas', code: 'MAT101' },
    { name: 'Historia', code: 'HIS202' },
    { name: 'Ciencias', code: 'SCI303' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {}

  // Getter para contar las asignaturas inscritas
  get enrolledSubjectsCount(): number {
    return this.subjects.length;
  }

  // Método para navegar a la página de detalles de la asignatura
  goToDetail(subjectCode: string) {
    this.router.navigate(['/detalle-asignatura', subjectCode]);
  }
}
