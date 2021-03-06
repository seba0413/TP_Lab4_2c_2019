import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MesasService } from 'src/app/servicios/mesas/mesas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-mesa',
  templateUrl: './asignar-mesa.component.html',
  styleUrls: ['./asignar-mesa.component.css']
})
export class AsignarMesaComponent implements OnInit {

  @Output() enviarMesaAsignada = new EventEmitter<any>();
  @Input() listadoClientesEnEspera;
  idClienteEnEspera;
  clienteElegido; 
  mesasDisponibles = new Array<any>(); 
  verClientesEnEspera:boolean;
  verMesasDisponibles:boolean = false;  

  constructor(private mesasService: MesasService) { }

  elegirCliente(idCliente){
    this.idClienteEnEspera = idCliente;
    this.obtenerNombreClienteElegido(idCliente);
    this.mesasService.ObtenerMesasDisponiblesMozo().subscribe(respuesta => {
      if(respuesta.Estado == "Disponibles") {
        this.mesasDisponibles = respuesta.Mesas;
        this.verMesasDisponibles = true;
      }
      else {
        Swal.fire({
          title: 'Cliente en Espera',
          text: "No hay mesas disponibles",
          confirmButtonColor: '#3085d6',
        })
      }

    })
  }

  asignarMesa(codigoMesa){
    this.mesasService.CambiarEstadoMesaAsignada(codigoMesa, this.idClienteEnEspera).subscribe(respuesta => {
      this.enviarMesaAsignada.emit(true);
      Swal.fire({
        position: 'top-end',
        title: respuesta.Mensaje,
        showConfirmButton: false,
        timer: 1500
        });
        if(respuesta.Estado == "Ok"){
          this.mesasService.ObtenerClientesEnEspera().subscribe(respuesta => {
            if(respuesta.Estado == "Clientes")
              this.listadoClientesEnEspera = respuesta.Clientes;
            else if(respuesta.Estado == "Vacio")
              this.listadoClientesEnEspera = new Array<any>();
          })
        } 
    });
    this.verMesasDisponibles = false; 
  }

  obtenerNombreClienteElegido(idCliente) {
    this.listadoClientesEnEspera.forEach(element => {
      if(element.idCliente == idCliente)
        this.clienteElegido = element.usuario;     
    });
  }

  ngOnInit() {
  }
 
}
