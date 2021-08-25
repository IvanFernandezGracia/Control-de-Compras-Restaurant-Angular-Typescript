import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BoletaServicio } from "src/app/servicios/boleta.service";
import { Boleta } from "src/app/modelo/boleta.model";
import { FlashMessagesService } from "angular2-flash-messages";
import { NgForm } from "@angular/forms";
import firebase from "firebase/app";
import { Compra } from "src/app/modelo/compra.model";

@Component({
  selector: "app-boletas",
  templateUrl: "./boletas.component.html",
  styleUrls: ["./boletas.component.css"],
})
export class BoletasComponent implements OnInit {
  boletas: Boleta[];
  compra: Compra = {
    orden: 0,
    cantidad: 0,
    producto: "Ejm Compra Name",
    valorUnidad: 0,
  };
  boleta: Boleta = {
    nombre: "",
    apellido: "",
    email: "",
    compras: [this.compra],
    mostrarCompras: false,
    mesa: 0,
    fechaCreacion: firebase.firestore.Timestamp.fromDate(new Date()),
  };

  mostrarForm: boolean = false;
  cargaTablero: boolean = true;

  @ViewChild("boletaForm") boletaForm: NgForm;
  @ViewChild("botonCerrar") botonCerrar: ElementRef;
  @ViewChild("botonEliminarBoleta") botonEliminarBoleta: ElementRef;
  @ViewChild("CompraForm") compraForm: NgForm;
  @ViewChild("botonAddCompra") botonAddCompra: ElementRef;

  constructor(
    private boletasServicio: BoletaServicio,
    private flashMessages: FlashMessagesService
  ) {}

  ngOnInit() {
    this.boletasServicio.getBoletas().subscribe((boletas) => {
      this.boletas = boletas;
      this.cargaTablero=false;
    });
  }

  getGananciasTotal() {
    let gananciaTotal: number = 0;
    if (this.boletas) {
      this.boletas.forEach((boleta) => {
        boleta.compras.forEach((compra) => {
          gananciaTotal += compra.valorUnidad * compra.cantidad;
        });
      });
    }
    return gananciaTotal;
  }

  agregarBoleta({ value, valid }: { value: Boleta; valid: boolean }) {
    this.boletaForm.resetForm();
    this.desactivateAddBoleta();
    if (!valid) {
      this.flashMessages.show("Por favor llena el formulario correctamente", {
        cssClass: "alert-danger",
        timeout: 2000,
      });
    } else {
      this.boletasServicio
        .agregarBoleta(value)
        .then(() => {
          this.flashMessages.show(
            "Se agrego correctamente la Boleta \n: " +
              `${value.nombre} ${value.apellido} en Mesa ${value.mesa}`,
            {
              cssClass: "alert-success",
              timeout: 2000,
            }
          );
          setTimeout(() => {
            this.cerrarModal(this.botonCerrar);
          }, 2000);
        })
        .catch((error) => {
          this.flashMessages.show(
            "Error: No se agrego a la base de datos  " + error,
            {
              cssClass: "alert-danger",
              timeout: 4000,
            }
          );
        });
    }
  }

  private cerrarModal(element:ElementRef) {
    element.nativeElement.click();
  }

  valueInitFormsAdd() {
    this.boleta = {
      nombre: "Ivan",
      apellido: "Fernandez",
      email: "ivan.fernandez.g@usach.cl",
      compras: [],
      mesa: 17,
    };
  }

  valueInitFormsAddCompras() {
    this.compra = {
      orden: 0,
      producto: "Bebestible",
      cantidad: 2,
      valorUnidad: 2000,
    };
  }

  getTotalBoleta(boleta: Boleta) {
    let Total: number = 0;
    if (boleta) {
      boleta.compras.forEach((Compra) => {
        Total += Compra.valorUnidad * Compra.cantidad;
      });
    }
    return Total;
  }

  activateMenuCompras(boletaElement: Boleta) {
    if (boletaElement.mostrarCompras === false) {
      boletaElement.mostrarCompras = true;
      return "Ver";
    } else {
      boletaElement.mostrarCompras = false;
      return "";
    }
  }

  timestampToDate(timestampData: firebase.firestore.Timestamp) {
    let date = new Date(timestampData.seconds * 1000);
    let minute = (val) => {
      if (parseFloat(val) < 10) {
        return "0" + val;
      } else {
        return val;
      }
    };
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      minute(date.getMinutes())
    );
  }

  activateAddBoleta() {
    this.valueInitFormsAdd();
    this.mostrarForm = true;
  }

  activateAddCompra() {
    this.valueInitFormsAddCompras();
  }

  desactivateAddBoleta() {
    this.mostrarForm = false;
  }

  addBoletaClass(boleta) {
    this.boleta = boleta;
    this.activateAddCompra();
  }

  eliminarBoleta() {
    this.boletasServicio.eliminarBoleta(this.boleta).then(() => {
      this.cerrarModalEliminarBoleta();
    });
  }
  cerrarModalEliminarBoleta() {
    this.botonEliminarBoleta.nativeElement.click();
  }

  agregarCompra({ value, valid }: { value: Compra; valid: boolean }) {
    this.compraForm.resetForm();
    if (!valid) {
      console.log("Malo formulario");
    } else {
      this.boletasServicio.agregarCompra(value, this.boleta.id,0);
      this.cerrarModal(this.botonAddCompra);
    }
  }

  mostrarCompraDelete(mostrar:boolean){
    console.log(mostrar)
  }
  mostrarAllMenuCompras(){
    this.boletasServicio.activateMenusCompras()
  }


}
