import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Subject } from '../models/subject';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  private readonly SUBJECTS_KEY = 'subjects';
  private cachedSubjects: Subject[] | null = null; // Cache local

  constructor(
    private storageService: StorageService,
    private loginService: LoginService // Inyección del LoginService
  ) {
    this.initializeSubjects();
  }

  // Inicializar asignaturas si no existen en el almacenamiento
  async initializeSubjects(): Promise<void> {
    try {
      if (!this.cachedSubjects) {
        const existingSubjects = await this.storageService.get(this.SUBJECTS_KEY);

        if (!existingSubjects) {
          // Generar asignaturas iniciales
          const initialSubjects = [
            new Subject('Matemáticas', 'MAT101'),
            new Subject('Historia', 'HIS202'),
            new Subject('Ciencias', 'SCI303'),
          ];

          // Guardar asignaturas iniciales en el almacenamiento
          await this.storageService.set(this.SUBJECTS_KEY, initialSubjects);
          this.cachedSubjects = initialSubjects;
        } else {
          // Mapear los datos del almacenamiento al modelo `Subject`
          this.cachedSubjects = existingSubjects.map(
            (s: any) => new Subject(s.name, s.code, s.attendance)
          );
        }
      }
    } catch (error) {
      console.error('Error al inicializar las asignaturas:', error);
    }
  }

  // Obtener asignaturas desde el cache o almacenamiento
  async getSubjects(): Promise<Subject[]> {
    if (!this.cachedSubjects) {
      await this.initializeSubjects();
    }
    return this.cachedSubjects || [];
  }

  // Obtener asignatura específica por código
  async getSubjectByCode(code: string): Promise<Subject | null> {
    const subjects = await this.getSubjects();
    return subjects.find((subject) => subject.code === code) || null;
  }

  // Actualizar una asignatura en el almacenamiento
  async updateSubject(subject: Subject): Promise<void> {
    const subjects = await this.getSubjects();
    const index = subjects.findIndex((s) => s.code === subject.code);

    if (index !== -1) {
      subjects[index] = subject; // Actualizar asignatura
      await this.storageService.set(this.SUBJECTS_KEY, subjects); // Guardar en almacenamiento
    }
  }
}
