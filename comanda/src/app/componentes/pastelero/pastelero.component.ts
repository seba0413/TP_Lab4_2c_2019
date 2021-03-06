import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/servicios/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EmpleadosService } from 'src/app/servicios/empleados/empleados.service';

@Component({
  selector: 'app-pastelero',
  templateUrl: './pastelero.component.html',
  styleUrls: ['./pastelero.component.css']
})
export class PasteleroComponent implements OnInit {

  idPastelero;
  nombrePastelero;
  idSector;
  foto;
  pedidosPendientes = new Array<any>();
  pedidosEnPreparacion = new Array<any>();

  constructor( private loginService: LoginService,  private rutaActiva: ActivatedRoute,  private router: Router, private empleadosService: EmpleadosService) { }

  recibeSeTomoPedido(event) {
    if(event) {
      this.actualizarPedidosPendientes();
      this.actualizarPedidosEnPreparacion();
    }
  }

  recibeServirPedido(event) {
    if(event) {
      this.actualizarPedidosEnPreparacion();
    }
  }

  actualizarPedidosPendientes(){
    this.empleadosService.VerPedidosPendientes(1, this.idSector).subscribe(respuesta => {
      if(respuesta.Estado == "Ok"){
        this.pedidosPendientes = respuesta.Pedidos;
      }
      else if(respuesta.Estado == "SinPedidos") {
        this.pedidosPendientes = new Array<any>();
      }
    })
  }

  actualizarPedidosEnPreparacion(){
    this.empleadosService.VerPedidosPendientes(2, this.idSector).subscribe(respuesta => {
      if(respuesta.Estado == "Ok"){
        this.pedidosEnPreparacion = respuesta.Pedidos;
      }
      else if(respuesta.Estado == "SinPedidos") {
        this.pedidosEnPreparacion = new Array<any>();
      }
    })
  }

  cerrarSesion(){
    Swal.fire({
      title: 'Cerrar sesion',
      text: "¿Seguro queres cerrar sesión?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        localStorage.clear();
        this.router.navigate(['']);
      }
    })
  }

  ngOnInit() {
    this.idPastelero = this.rutaActiva.snapshot.params.idPastelero;
    this.loginService.BuscarUsuario(this.idPastelero).subscribe(respuesta => {
      if (respuesta.Estado == "Ok") {
        this.nombrePastelero = respuesta.Usuario.usuario;
        this.idSector = respuesta.Usuario.id_sector;
        this.foto = respuesta.Usuario.foto;

        this.actualizarPedidosPendientes();
        this.actualizarPedidosEnPreparacion();
      }
    })

  }

  w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
  }

  w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
  }

}
