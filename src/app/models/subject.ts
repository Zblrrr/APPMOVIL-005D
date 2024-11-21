export class Subject {
    name: string; // Nombre de la asignatura
    code: string; // Código de la asignatura
    attendance: { class: string; present: boolean }[]; // Lista de clases y asistencia
  
    constructor(
      name: string,
      code: string,
      attendance: { class: string; present: boolean }[] = []
    ) {
      this.name = name;
      this.code = code;
      this.attendance = attendance;
    }
  }
  
