import { Component, OnInit } from '@angular/core';
import  firebase from 'firebase';
import { LoginService } from './login/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  titulo = 'Listado de Personas';

  constructor(private loginService: LoginService){}

  ngOnInit(): void {
   firebase.initializeApp({
    apiKey: "AIzaSyD05RRov9UH4lpvztoqwNSJsNo2mQH8gNo",
    authDomain: "listado-personas-a8e4f.firebaseapp.com",
   })
   console.log(firebase)
  }

  isAutenticado(){
    return this.loginService.isAutenticado();
  }

  salir(){
    this.loginService.logout();
  }

}
