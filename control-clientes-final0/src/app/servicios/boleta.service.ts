import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
import { Boleta } from "../modelo/boleta.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Compra } from "src/app/modelo/compra.model";
import firebase from "firebase";
import { BoletaUpdate } from "../modelo/boletaUpdate.model";

@Injectable()
export class BoletaServicio {
  boletaColeccion: AngularFirestoreCollection<Boleta>;
  boletaDoc: AngularFirestoreDocument<Boleta>;
  boletas: Observable<Boleta[]>;
  boleta: Observable<Boleta>;

  constructor(private db: AngularFirestore) {
    this.boletaColeccion = db.collection("clientes", (ref) =>
      ref.orderBy("fechaCreacion", "desc")
    );
  }

  getBoletas(): Observable<Boleta[]> {
    this.boletas = this.boletaColeccion.snapshotChanges().pipe(
      map((cambios) => {
        return cambios.map((accion) => {
          const datos = accion.payload.doc.data();
          datos.id = accion.payload.doc.id;
          return datos;
        });
      })
    );
    return this.boletas;
  }

  agregarBoleta(boleta: Boleta) {
    let boletaFirebase = boleta as Boleta;
    boletaFirebase["compras"] = [];
    boletaFirebase["fechaCreacion"] = firebase.firestore.Timestamp.now();
    boletaFirebase["mostrarCompras"] = false;
    return this.boletaColeccion.add(boletaFirebase);
  }

  getCliente(id: string) {
    this.boletaDoc = this.db.doc<Boleta>(`clientes/${id}`);
    this.boleta = this.boletaDoc.snapshotChanges().pipe(
      map((accion) => {
        if (accion.payload.exists === false) {
          return null;
        } else {
          const datos = accion.payload.data() as Boleta;
          datos.id = accion.payload.id;
          return datos;
        }
      })
    );
    return this.boleta;
  }

  eliminarBoleta(boleta: Boleta) {
    this.boletaDoc = this.db.doc(`clientes/${boleta.id}`);
    return this.boletaDoc.delete();
  }

  agregarCompra(compra: Compra, id: string, maxIntent: number) {
    let compraFirebase = compra as Compra;
    let observableAddCompra = this.getCliente(id).subscribe((boleta) => {
      observableAddCompra.unsubscribe();
      if (boleta.compras.length === 0) {
        compraFirebase.orden = 1;
      } else {
        compraFirebase.orden =
          boleta.compras[boleta.compras.length - 1].orden + 1;
      }
      let response = this.db.doc<BoletaUpdate>(`clientes/${id}`).update({
        compras: firebase.firestore.FieldValue.arrayUnion(compraFirebase),
      });
      response
        .then(() => {
          console.log(true);
        })
        .catch(() => {
          if (maxIntent < 5) {
            this.agregarCompra(compra, id, maxIntent + 1);
          }
        });
    });
  }

  eliminarCompra(id: string, nowCompras: Array<Compra>, compraElement: Compra) {
    this.boletaDoc = this.db.doc(`clientes/${id}`);
    return this.boletaDoc.update({
      compras: nowCompras.filter((value) => value !== compraElement),
    });
  }

  editarCompra(id: string, nowCompras: Array<Compra>, compraElement: Compra) {
    this.boletaDoc = this.db.doc(`clientes/${id}`);
    let index = nowCompras.findIndex(
      (item) => item.orden === compraElement.orden
    );
    nowCompras[index] = compraElement;
    return this.boletaDoc.update({
      compras: nowCompras,
      mostrarCompras: false,
    });
  }

  activateMenusCompras() {
    this.boletaColeccion = this.db.collection("clientes/", (ref) =>
      ref.where("mostrarCompras", "==", false)
    );
  }
}
