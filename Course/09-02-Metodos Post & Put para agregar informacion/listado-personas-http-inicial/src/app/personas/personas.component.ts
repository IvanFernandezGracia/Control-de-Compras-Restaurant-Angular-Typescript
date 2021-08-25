import { Component, OnInit } from '@angular/core';
import { Persona } from '../persona.model';
import { LoggingService } from '../LoggingService.service';
import { PersonasService } from '../personas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  personas: Persona[] = [];
  
  constructor(
    private personasService: PersonasService,
    private router:Router
  ){}
    
    ngOnInit(): void {
     this.personas = this.personasService.personas;
    }
 
    agregar(){
      this.router.navigate(['personas/agregar']);
    }
}
