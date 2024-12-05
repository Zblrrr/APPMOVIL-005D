export class Subject {
    name: string; // Nombre de la asignatura
    code: string; // Código de la asignatura
    attendance: { [user: string]: { class: string; present: boolean }[] }; // Asistencia por usuario
  
    constructor(
      name: string,
      code: string,
      attendance: { [user: string]: { class: string; present: boolean }[] } = {}
    ) {
      this.name = name;
      this.code = code;
      this.attendance = attendance;
    }
  }
  
