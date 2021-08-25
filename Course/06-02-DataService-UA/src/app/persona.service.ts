import { Persona } from './persona.model';

export class PersonasService {
  personas: Persona[] = [
    new Persona('Juan', 'Perez'),
    new Persona('Laura', 'Juarez'),
  ];

  agregarPersona(persona: Persona) {
    this.personas.push(persona);
  }
}
