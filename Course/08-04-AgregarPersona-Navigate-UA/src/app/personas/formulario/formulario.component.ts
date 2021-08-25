import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoggingService } from '../../LoggingService.service';
import { Persona } from '../../persona.model';
import { PersonasService } from '../../persona.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent  {
  nombreInput:string;
  apellidoInput:string;  

  constructor(private personaService:PersonasService,
              private router: Router){}

  guardarPersona(){
    let persona1 = new Persona(this.nombreInput, this.apellidoInput);
    this.personaService.agregarPersona(persona1);
    this.router.navigate(['personas']);
  }

}
