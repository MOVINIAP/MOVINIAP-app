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

declare var $: any;

interface Ciudad {
  id_ciudad: number;
  ciudad: string;
}

@Component({
  selector: 'app-realizar-orden',
  templateUrl: './realizar-orden.component.html',
  styleUrls: ['./realizar-orden.component.scss']
})
export class RealizarOrdenComponent {
  opciones_transporte = ['OFICIAL', 'PARTICULAR'];
  opciones_motivo = ['INTERNA', 'VIATICOS', 'MOVILIZACION'];
  filteredCiudades!: Observable<any[]>;
  filteredEmpleados!: Observable<any[]>;
  ciudades: any[] = []; // Aquí debes reemplazar con tus ciudades
  empleado_nombres: any[] = [];
  botonClicked = false;
  solicitudForm!: FormGroup;
  transporteForm!: FormGroup;
  conjuntosForm: FormGroup[] = [];
  selectedCiudadId!:number;
  id_solicitud!:number;
  minDate!: string;
  errorFecha: boolean = false;

  constructor(
    private listCBXService: listCBX,
    private snackBar: MatSnackBar, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private registrarSolicitudService: RegistrarDataService,
    private registrarTransporteService: RegistrarDataService,
    ) {
    // Calcular la fecha actual en formato yyyy-MM-dd
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
        
    // Asignar la fecha actual a minDate
    this.minDate = `${year}-${month}-${day}`;
    this.agregarConjunto();
    
   }

  ngOnInit() {
    this.getAllNombresCiudades();
    this.getAllEmpleados();
    this.initForm();
    this.trasporteForm() ;
    this.filteredCiudades = this.solicitudForm.get('id_ciudad_destino')!.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterCiudades(value))
    );
  }

  getAllNombresCiudades(): void {
    this.listCBXService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
      },
      error => {
        console.error(error);
      }
    );
  }

  getAllEmpleados(): void {
    this.listCBXService.getEmpleados().subscribe(
      data => {
        this.empleado_nombres = data;
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


  private initForm() {
    this.solicitudForm = this.formBuilder.group({
      id_ciudad_destino: ['', Validators.required],
      motivo_movilizacion: ['', Validators.required],
      fecha_salida_solicitud: ['', Validators.required],
      hora_salida_solicitud: ['', Validators.required],
      fecha_llegada_solicitud: ['', Validators.required],
      hora_llegada_solicitud: ['', Validators.required],
      descripcion_actividades: ['', Validators.required],
      listado_empleados: ['', Validators.required],
      estado_solicitud: ['BORRADOR', Validators.required]
    });
  }

  private trasporteForm() {
    this.transporteForm = this.formBuilder.group({
      tipo_transporte_soli: ['', Validators.required],
      nombre_transporte_soli: ['', Validators.required],
      ruta_soli: ['', Validators.required],
      fecha_salida_soli: ['', Validators.required],
      hora_salida_soli: ['', Validators.required],
      fecha_llegada_soli: ['', Validators.required],
      hora_llegada_soli: ['', Validators.required],
    });
  }

  enviarSolicitud() {
    if (this.solicitudForm.valid) {
      // Obtén el ID de la ciudad seleccionada utilizando selectedCiudadId
      const idCiudadSeleccionada = this.selectedCiudadId;
      const idEmpleado = this.authService.getIdEmpleadoFromToken();
      const motivoMovilizacionControl = this.solicitudForm.get('motivo_movilizacion');
      const motivoMovilizacion = motivoMovilizacionControl?.value || '';
  
      // Define el valor de idOm basado en el valor de motivoMovilizacion
      let idOm = motivoMovilizacion === 'INTERNA' ? '1' : '2';
      
      // Obtiene los nombres de empleados seleccionados y los convierte en una cadena separada por comas
      const empleadosSeleccionadosControl = this.solicitudForm.get('listado_empleados');
      const empleadosSeleccionados = empleadosSeleccionadosControl?.value || '';
      const listadoEmpleados = empleadosSeleccionados.join(', ');
  
      // Ahora puedes enviar los datos del formulario con el ID de la ciudad y otros valores
      const formData = {
        ...this.solicitudForm.value,
        id_ciudad_destino: idCiudadSeleccionada,
        id_empleado: idEmpleado,
        id_tipo_om: idOm,
        listado_empleados: listadoEmpleados 
      };
      this.registrarSolicitudService.registrarSolicitud(formData).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          console.log(response.id_solicitud);
          this.id_solicitud = parseInt(response.id_solicitud!,10);
        },
        (error) => {
          console.error('Error al enviar datos:', error);
        }
      );
      console.log(formData);
  

    } else {

    }
  }

  enviarTransporte() {
    if (this.transporteForm.valid) {
      // Obtener los datos del formulario
      const dataToSend = this.transporteForm.value;
      const idSolicitud = this.id_solicitud 

      // Llamar al servicio para registrar el transporte
      this.registrarTransporteService.registrarTransporte(idSolicitud, dataToSend).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          console.error('Error al registrar transporte:', error);
        }
      );

      this.mostrarMensajeConfirmacion2();
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
    this.snackBar.open('¡Solicitud regitrada!', 'Cerrar', {
      duration: 5000, // Duración del mensaje en milisegundos (3 segundos en este caso)
    });
  }
  mostrarMensajeConfirmacion2() {
    this.snackBar.open('¡Ruta resgistrada!', 'Cerrar', {
      duration: 5000, // Duración del mensaje en milisegundos (3 segundos en este caso)
    });
  } 
  abrirDialogoConfirmacion() {
    this.verificarFecha();
    if (this.errorFecha==true) {
      Swal.fire({
        title: 'Registrar solicitud',
        text: 'Una vez que la registres, solo la podrás editar desde tu lista de solicitudes',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí puedes realizar acciones si el usuario hizo clic en Aceptar
          this.enviarInformacion();
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
      title: '¡Solicitud envíada!',
      text: 'Se ha envíado la solicitud con éxito, espera la respuesta del administrador',
      icon: 'success', // Utiliza 'success' para mostrar un visto de color verde
      showConfirmButton: false, // Oculta el botón de confirmar
      timer: 5000, // Muestra el mensaje por 5 segundos
    }).then((result) => {
      // Este bloque de then no se ejecutará, ya que no hay botón de confirmar
    });
  }

  verificarFecha() {
    const fechaSalidaControl = this.solicitudForm.get('fecha_salida_solicitud');
    const fechaLlegadaControl = this.solicitudForm.get('fecha_llegada_solicitud');
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
  
  
  agregarConjunto() {
    // Agregar un nuevo conjunto de datos vacío al array con su propio FormGroup
    const nuevoConjunto = this.formBuilder.group({
      tipo_transporte: ['', Validators.required],
      nombre_transporte: ['', Validators.required],
      ruta: ['', Validators.required],
      fecha_salida_soli: ['', Validators.required],
      hora_salida_soli: ['', Validators.required],
      fecha_llegada_soli: ['', Validators.required],
      hora_llegada_soli: ['', Validators.required],
    });
    this.conjuntosForm.push(nuevoConjunto);
  }

  quitarConjunto() {
    // Remover el último conjunto de datos del array
    this.conjuntosForm.pop();
  }

  enviarInformacion() {
    if (!this.botonClicked) {
      // Lógica para realizar acciones solo la primera vez que se hace clic en el botón
      this.enviarSolicitud();
      this.mostrarMensajeConfirmacion()
      this.botonClicked = true;
    } else {
      console.log("El botón ya fue clickeado");
    }
  }

}
