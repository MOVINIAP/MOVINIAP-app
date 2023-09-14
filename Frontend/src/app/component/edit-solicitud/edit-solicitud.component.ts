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
import { ActivatedRoute, Params } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ListForByIdService } from 'src/app/services/solicitudes-by-id.service';

declare var $: any;

interface Ciudad {
  id_ciudad: number;
  ciudad: string;
}
interface Transporte {
  tipo_transporte_soli: string;
  nombre_transporte_soli: string;
  ruta_soli: string;
  fecha_salida_soli: string;
  hora_salida_soli:string,
  fecha_llegada_soli: string;
  hora_llegada_soli:string,
  // Otros campos si los tienes
}

@Component({
  selector: 'app-edit-solicitud',
  templateUrl: './edit-solicitud.component.html',
  styleUrls: ['./edit-solicitud.component.scss']
})
export class EditSolicitudComponent implements OnInit{
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
  conjuntosForm2: FormGroup[] = [];
  selectedCiudadId!:number;
  id_solicitud!:number;
  minDate!: string;
  idSolicitud!: number;
  solicitudDeatil: any={};
  fechaSalida: string = '';
  fechaLlegada: string = '';
  rutasTransporte: any[] = [];

  

  constructor(
    private listCBXService: listCBX,
    private snackBar: MatSnackBar, 
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private registrarTransporteService: RegistrarDataService,
    private route: ActivatedRoute, 
    private sharedataservice:SharedDataService,
    private solicitudesIDService: ListForByIdService
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
    this.route.params.subscribe((params: Params) => {
      const idFromTable = this.sharedataservice.getSolicitudId();
      console.log('ID recibido:', idFromTable);
      this.agregarInformacion(idFromTable);
    });
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
  /*   this.registrarSolicitudService.registrarSolicitud(formData).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          console.log(response.id_solicitud);
          this.id_solicitud = parseInt(response.id_solicitud!,10);
        },
        (error) => {
          console.error('Error al enviar datos:', error);
        }
      ); */
      console.log(formData);
  

    } else {

    }
  }

  enviarTransporte() {
    if (this.transporteForm.valid) {
      // Obtener los datos del formulario
      const dataToSend = this.transporteForm.value;
      const idSolicitud = this.id_solicitud 
      console.log(this.transporteForm.value);
      // Llamar al servicio para registrar el transporte
     /* this.registrarTransporteService.registrarTransporte(idSolicitud, dataToSend).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
        },
        (error) => {
          console.error('Error al registrar transporte:', error);
        }
      );*/

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

  agregarInformacion(idSolicitud:number)
  {
    this.idSolicitud = idSolicitud;
    this.solicitudesIDService.getDetallePorIDSolicitud(this.idSolicitud).subscribe(
      data => {
        this.solicitudDeatil = data;
       // console.log(this.solicitudDeatil.transporte_solicitudes);
        
        const fechaOriginal = this.solicitudDeatil.fecha_salida;

        // Convierte la fecha al formato "yyyy-MM-dd"
        const partesFecha = fechaOriginal.split('-');
        if (partesFecha.length === 3) {
          this.fechaSalida = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
        }
        const fecha_salida = this.solicitudForm.get('fecha_salida_solicitud');
        if (fecha_salida) {
          fecha_salida.setValue(this.fechaSalida);
        }

        const fechaOriginal2 = this.solicitudDeatil.fecha_llegada;

        // Convierte la fecha al formato "yyyy-MM-dd"
        const partesFecha2 = fechaOriginal2.split('-');
        if (partesFecha2.length === 3) {
          this.fechaLlegada = `${partesFecha2[2]}-${partesFecha2[1]}-${partesFecha2[0]}`;
        }
        const fechaLlegada = this.solicitudForm.get('fecha_llegada_solicitud');
        if (fechaLlegada) {
          fechaLlegada.setValue(this.fechaLlegada);
        }

        //const rutas = this.solicitudDeatil.transporte_solicitudes;

        const rutas = this.solicitudDeatil.transporte_solicitudes.map((transporte: Transporte) => ({
          tipo_transporte_soli: transporte.tipo_transporte_soli,
          nombre_transporte_soli: transporte.nombre_transporte_soli,
          ruta_soli: transporte.ruta_soli,
          fecha_salida_soli: transporte.fecha_salida_soli,
          hora_salida_soli: transporte.hora_salida_soli,
          fecha_llegada_soli: transporte.fecha_llegada_soli,
          hora_llegada_soli: transporte.hora_llegada_soli
        }));

        this.rutasTransporte = rutas;
        console.log(rutas);
        this.crearFormularioParaRutas();
  });

  }

  crearFormularioParaRutas() {
    this.conjuntosForm = [];
  
    // Recorre el arreglo rutasTransporte y crea un formulario para cada ruta
    for (const ruta of this.rutasTransporte) {
      const conjuntoForm = this.formBuilder.group({
        tipo_transporte_soli: [ruta.tipo_transporte_soli, Validators.required],
        nombre_transporte_soli: [ruta.nombre_transporte_soli, Validators.required],
        ruta_soli: [ruta.ruta_soli, Validators.required],
        fecha_salida_soli: [ruta.fecha_salida_soli, Validators.required],
        hora_salida_soli: [ruta.hora_salida_soli, Validators.required],
        fecha_llegada_soli: [ruta.fecha_llegada_soli, Validators.required],
        hora_llegada_soli: [ruta.hora_llegada_soli, Validators.required],
      });
      this.conjuntosForm.push(conjuntoForm);
    }
  }
  
}
