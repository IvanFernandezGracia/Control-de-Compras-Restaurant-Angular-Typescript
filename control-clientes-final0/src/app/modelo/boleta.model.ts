import { Compra } from 'src/app/modelo/compra.model';
import firebase from 'firebase';

export interface Boleta{
    id?:string;
    nombre?:string;
    apellido?:string;
    email?:string;
    compras?:Array<Compra>;
    mostrarCompras?:boolean;
    mesa?:number;
    fechaCreacion?:firebase.firestore.Timestamp;
}
