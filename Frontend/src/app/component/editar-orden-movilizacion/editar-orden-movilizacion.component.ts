import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { listCBX } from 'src/app/services/ciudades.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrarDataService } from 'src/app/services/registrar-data.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ListForByIdService } from 'src/app/services/solicitudes-by-id.service';

declare var $: any;

interface Ciudad {
  id_ciudad: number;
  ciudad: string;
}

interface empleados_solicitantes{
  id_empleado: number;
  empleado_nombres: string;
}

interface empleados_conductores{
  id_empleado: number;
  empleado_nombres: string;
}

@Component({
  selector: 'app-editar-orden-movilizacion',
  templateUrl: './editar-orden-movilizacion.component.html',
  styleUrls: ['./editar-orden-movilizacion.component.scss']
})
export class EditarOrdenMovilizacionComponent {
  opciones_transporte = ['OFICIAL', 'PARTICULAR'];
  opciones_motivo = ['INTERNA', 'VIATICOS', 'MOVILIZACION'];
  filteredCiudades!: Observable<any[]>;
  filteredEmpleados!: Observable<any[]>;
  filteredEmpleadoConductor!: Observable<any[]>;
  filteredVehiculo!: Observable<any[]>;
  ciudades: any[] = [];
  empleados_solicitantes: any[] = []; 
  selectedEmpleadoId!:number;
  empleado_conductor: any[] = []; 
  selectedEmpleadoConductorId!:number;
  vehiculos: any[] = []; 
  selectedVehiculoId!:number;
  empleado_nombres1: any[] = [];
  botonClicked = false;
  ordenForm!: FormGroup;
  conjuntosForm: FormGroup[] = [];
  selectedCiudadId!:number;
  id_Orden!:number;
  minDate!: string;
  errorFecha: boolean = false;
  ordenDetail:any={};
  fechaSalida: string = '';
  fechaLlegada: string = '';

  constructor(
    private listCBXService: listCBX,
    private snackBar: MatSnackBar, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private registrarSolicitudService: RegistrarDataService,
    private registrarTransporteService: RegistrarDataService,
    private vehículosList: VehiculosService,
    private route: ActivatedRoute, 
    private sharedataservice:SharedDataService,
    private ordenesIDService: ListForByIdService,
    private router: Router,
    ) {
    // Calcular la fecha actual en formato yyyy-MM-dd
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
        
    // Asignar la fecha actual a minDate
    this.minDate = `${year}-${month}-${day}`;
    
   }

  ngOnInit() {
    this.getAllNombresCiudades();
    this.getAllEmpleados2();
    this.getAllEmpleados3();
    this.getAllEmpleados();
    this.getAllVehiculos();
    this.initForm();
  /*  this.filteredCiudades = this.ordenForm.get('id_ciudad_destino')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCiudades(value))
    );
    this.filteredEmpleados = this.ordenForm.get('id_empleado_solicitante')!.valueChanges.pipe(  
      startWith(''),
      map((value) => this.filterEmpleadoSolicitante(value))
    );
    this.filteredEmpleadoConductor = this.ordenForm.get('id_empleado_conductor')!.valueChanges.pipe(  
      startWith(''),
      map((value) => this.filterEmpleadoConductor(value))
    );
    this.filteredVehiculo = this.ordenForm.get('id_vehiculo')!.valueChanges.pipe(  
      startWith(''),
      map((value) => this.filtervehiculos(value))
    );*/
    this.route.params.subscribe((params: Params) => {
      const idFromTable = this.sharedataservice.getOrdenId();
      console.log('ID recibido:', idFromTable);
      this.agregarInformacion(idFromTable);
    });
  }

  agregarInformacion(idOrden:number)
  {
    this.id_Orden = idOrden;
    this.ordenesIDService.getDetalleOrdenMovilizacionGenerarPDF(this.id_Orden).subscribe(
      data => {
        this.ordenDetail = data;
       console.log(this.ordenDetail);

  });

  }

  volver(): void
  {
    this.router.navigate(['../ver-solicitud'], { relativeTo: this.route });
  }

  getAllNombresCiudades(): void {
    this.listCBXService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
       // console.log(this.ciudades);
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllEmpleados(): void {
    this.listCBXService.getEmpleados().subscribe(
      data => {
       this.empleado_nombres1 = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllEmpleados2(): void {
    this.listCBXService.getEmpleados().subscribe(
      data => {
        this.empleados_solicitantes = data;
      //  console.log(this.empleados_solicitantes);
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllEmpleados3(): void {
    this.listCBXService.getEmpleados().subscribe(
      data => {
        this.empleado_conductor = data;
      // console.log(this.empleado_conductor);
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllVehiculos(): void {
    this.vehículosList.getvehiculos().subscribe(
      data => {
        this.vehiculos = data;
       //console.log(this.vehiculos);
      },
      error => {
        console.error(error);
      }
    );
  }

    // Utiliza un observable para filtrar las ciudades según el texto ingresado en el input
  
    filterCiudades(value: string): Ciudad[] {
      const filterValue = value.toLowerCase();
      return this.ciudades.filter(ciudad => ciudad.ciudad.toLowerCase().includes(filterValue));
    }

    onCiudadSelected(event: MatAutocompleteSelectedEvent): void {
      const ciudadNombre = event.option.value;
      const selectedCiudad = this.ciudades.find(ciudad => ciudad.ciudad === ciudadNombre);
      if (selectedCiudad) {
        this.selectedCiudadId = selectedCiudad.id_ciudad;
      }
    }

    // Utiliza un observable para filtrar las ciudades según el texto ingresado en el input
  
    filterEmpleadoSolicitante(value: string): empleados_solicitantes[] {
      const filterValue = value.toLowerCase();
      return this.empleados_solicitantes.filter(empleado_nombres => empleado_nombres.empleado_nombres.toLowerCase().includes(filterValue));
    }

    onEmpleadoSolicitanteSelected(event: MatAutocompleteSelectedEvent): void {
      const empleadoNombre = event.option.value;
      const selectedempleado = this.empleados_solicitantes.find(empleado_nombres => empleado_nombres.empleado_nombres === empleadoNombre);
      if (selectedempleado) {
        this.selectedEmpleadoId = selectedempleado.id_empleado;
      }
    }

    
    // Utiliza un observable para filtrar las ciudades según el texto ingresado en el input
  
    filterEmpleadoConductor(value: string): empleados_conductores[] {
      const filterValue = value.toLowerCase();
      return this.empleado_conductor.filter(empleado_nombres => empleado_nombres.empleado_nombres.toLowerCase().includes(filterValue));
    }
    
    onEmpleadoConductorSelected(event: MatAutocompleteSelectedEvent): void {
      const empleadoNombreConductor = event.option.value;
      const selectedempleadoConductor = this.empleado_conductor.find(empleado_nombres => empleado_nombres.empleado_nombres === empleadoNombreConductor);
      if (selectedempleadoConductor) {
        this.selectedEmpleadoConductorId = selectedempleadoConductor.id_empleado;
      }
    }

        // Utiliza un observable para filtrar las ciudades según el texto ingresado en el input
  
        filtervehiculos(value: string): empleados_conductores[] {
          const filterValue = value.toLowerCase();
          return this.vehiculos.filter(placa => placa.placa.toLowerCase().includes(filterValue));
        }
        
        onvehiculoSelected(event: MatAutocompleteSelectedEvent): void {
          const vehiculoPlaca = event.option.value;
          const selectedvehiculo = this.vehiculos.find(placa => placa.placa === vehiculoPlaca);
          if (selectedvehiculo) {
            this.selectedVehiculoId = selectedvehiculo.id;
          }
        }



  private initForm() {
    this.ordenForm = this.formBuilder.group({
      ciudad_destino: ['', Validators.required],
      fecha_desde: ['', Validators.required],
      hora_desde: ['', Validators.required],
      fecha_hasta: ['', Validators.required],
      hora_hasta: ['', Validators.required],
      descripcion_actividades: ['', Validators.required],
      listado_acompanantes: ['', Validators.required],
      empleado_solicitante: ['', Validators.required],
      empleado_conductor: ['', Validators.required],
      placa_vehiculo: ['', Validators.required],
    });
  }

  enviarSolicitud() {
    if (this.ordenForm.valid) {
      // Obtén el ID de la ciudad seleccionada utilizando selectedCiudadId
      const idCiudadSeleccionada = this.selectedCiudadId;
      const idEmpleadoEmisor = this.authService.getIdEmpleadoFromToken();
      const id_empleado_solicitante = this.selectedEmpleadoId;
      const id_empleado_conductor = this.selectedEmpleadoConductorId;
      const id_vehiculo = this.selectedVehiculoId;
      const secuencialOM = null;
      const num_sec = null;
      
      // Obtiene los nombres de empleados seleccionados y los convierte en una cadena separada por comas
      const empleadosSeleccionadosControl = this.ordenForm.get('listado_empleados');
      const empleadosSeleccionados = empleadosSeleccionadosControl?.value || '';
      const listadoEmpleados = empleadosSeleccionados.join(', ');
  
      // Ahora puedes enviar los datos del formulario con el ID de la ciudad y otros valores
      const formData = {
        ...this.ordenForm.value,
        id_ciudad_destino: idCiudadSeleccionada,
        id_empleado_emisor: idEmpleadoEmisor,
        listado_empleados: listadoEmpleados,
        id_empleado_solicitante:id_empleado_solicitante,
        id_empleado_conductor: id_empleado_conductor,
        id_vehiculo: id_vehiculo,
        secuencial_orden_movilizacion: secuencialOM,
        num_orden_mov_cge: num_sec,
      };
      this.registrarSolicitudService.registrarOrden(formData).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          console.error('Error al enviar datos:', error);
        }
      );
      console.log(formData);

    } else {

    }
  }

  mostrarAlerta(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000, // Duración de la notificación en milisegundos
      horizontalPosition: 'center', // Posición horizontal de la notificación
      verticalPosition: 'bottom' // Posición vertical de la notificación
    });
  }
  mostrarMensajeConfirmacion() {
    this.snackBar.open('¡Orden envíada!', 'Cerrar', {
      duration: 5000, // Duración del mensaje en milisegundos (3 segundos en este caso)
    });
  }
  abrirDialogoConfirmacion() {
    this.verificarFecha();
    if (this.errorFecha==true) {
      Swal.fire({
        title: 'Agregar orden',
        text: 'Una vez agregada la orden no podrá editarla',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí puedes realizar acciones si el usuario hizo clic en Aceptar
          this.enviarInformacion();
          this.SolicitudEnviadaDialogo();
          // Lógica para continuar con la acción deseada
        } else {
          // Aquí puedes realizar acciones si el usuario hizo clic en Cancelar
        }
      });
    }
  }
  

  abrirDialogoConfirmacionEnviar() {
    Swal.fire({
      title: 'Enviar solicitud',
      text: 'Una vez enviada la solicitud, no podrás editarla.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes realizar acciones si el usuario hizo clic en Aceptar
        this.SolicitudEnviadaDialogo();
        console.log("Actualizar estado");
        // Lógica para continuar con la acción deseada
      } else {
        // Aquí puedes realizar acciones si el usuario hizo clic en Cancelar
      }
    });
  }


  SolicitudEnviadaDialogo() {
    Swal.fire({
      title: '¡Orden agregada!',
      text: 'Se ha envíado la orden con éxito, por medio del administrador',
      icon: 'success', // Utiliza 'success' para mostrar un visto de color verde
      showConfirmButton: false, // Oculta el botón de confirmar
      timer: 5000, // Muestra el mensaje por 5 segundos
    }).then((result) => {
      // Este bloque de then no se ejecutará, ya que no hay botón de confirmar
    });
  }

  verificarFecha() {
    const fechaSalidaControl = this.ordenForm.get('fecha_desde');
    const fechaLlegadaControl = this.ordenForm.get('fecha_hasta');
    // Verificar si fechaSalidaControl es nulo antes de usarlo
    if (fechaSalidaControl && fechaLlegadaControl) {
      const today = new Date();
      
      // Restar un día a la fecha actual
      today.setDate(today.getDate()-2);
  
      if (new Date(fechaSalidaControl.value) < today) {
        this.errorFecha=false;
        const nombreCampo = 'fecha de salida'; // Cambia esto al nombre real de tu campo
        const mensaje = `Has ingresado mal la ${nombreCampo}`;
        this.mostrarAlerta(mensaje);
        fechaSalidaControl.setValue('');
      }

      else if (new Date(fechaSalidaControl.value) > new Date (fechaLlegadaControl.value)) {
        this.errorFecha=false;
        const nombreCampo = 'fecha de llegada'; // Cambia esto al nombre real de tu campo
        const mensaje = `Has ingresado mal la ${nombreCampo}`;
        this.mostrarAlerta(mensaje);
        fechaLlegadaControl.setValue('');
      }
      else{
        this.errorFecha=true;
      }
    }
  }

  enviarInformacion() {
    if (!this.botonClicked) {
      // Lógica para realizar acciones solo la primera vez que se hace clic en el botón
      this.enviarSolicitud();
      this.botonClicked = true;
    } else {
      console.log("El botón ya fue clickeado");
    }
  }

}
