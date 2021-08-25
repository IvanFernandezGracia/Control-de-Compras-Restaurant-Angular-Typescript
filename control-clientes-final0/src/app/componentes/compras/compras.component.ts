import { Component, Input, OnInit,Output,EventEmitter,ViewChild} from "@angular/core";
import { Compra } from "src/app/modelo/compra.model";
import { BoletaServicio } from "src/app/servicios/boleta.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { NgForm } from "@angular/forms";
import { Boleta } from "src/app/modelo/boleta.model";

@Component({
  selector: "app-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.css"],
})
export class ComprasComponent implements OnInit {
  @Input() comprasCliente: Array<Compra>;
  @Input() indice: number;
  @Input() idBoleta: string;

  producto: string;
  cantidad: number;
  valorUnidad: number;
  modeEdit: boolean = false;
  compraEdit : Compra

  @ViewChild("CompraEditForm") compraEditForm: NgForm;

  constructor(
    private boletasServicio: BoletaServicio,
  ) {}

  ngOnInit() {}

  eliminarCompra(compraEliminar:Compra) {
    this.boletasServicio.eliminarCompra(this.idBoleta,this.comprasCliente,compraEliminar).then(() => {
      console.log("elimino compra perfectamente!")

    });
  }

  editarCompra(compraEditar:Compra) {
    this.compraEdit=compraEditar;
    this.modeEdit=true;
  }

  agregarCompra(){
    this.boletasServicio.editarCompra(this.idBoleta,this.comprasCliente, this.compraEdit)
    .then(() => {
      this.modeEdit=false;
    });
  }
}
