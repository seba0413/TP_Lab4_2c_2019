import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmpleadosService } from 'src/app/servicios/empleados/empleados.service';

@Component({
  selector: 'app-pedidos-en-preparacion',
  templateUrl: './pedidos-en-preparacion.component.html',
  styleUrls: ['./pedidos-en-preparacion.component.css']
})
export class PedidosEnPreparacionComponent implements OnInit {

  @Output() enviarServirPedido = new EventEmitter<any>();
  @Input() pedidos; 
  @Input() sectorId;

  constructor(private empleadoService: EmpleadosService) { }

  ServirPedido(codigo) {
    this.empleadoService.ServirPedido(codigo).subscribe(respuesta => {
      if(respuesta.Estado == "Ok") {
        this.enviarServirPedido.emit(true);
      }
    })    
  }

  ngOnInit() {
  }

}
