import { Compra } from 'src/app/modelo/compra.model';
import firebase from 'firebase';

export interface BoletaUpdate{
    id?:string;
    nombre?:string;
    apellido?:string;
    email?:string;
    compras?:Array<Compra> | firebase.firestore.FieldValue;
    mostrarCompras?:boolean;
    mesa?:number;
    fechaCreacion?:firebase.firestore.Timestamp;
}
