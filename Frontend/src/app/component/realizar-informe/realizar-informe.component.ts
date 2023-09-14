import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

declare var $: any;

@Component({
  selector: 'app-realizar-informe',
  templateUrl: './realizar-informe.component.html',
  styleUrls: ['./realizar-informe.component.scss']
})
export class RealizarInformeComponent {
  opciones_transporte = ['Camion', 'Camioneta'];
  opciones_motivo = ['Viáticos', 'Movilización'];
  filteredCiudades!: Observable<string[]>;
  botonClicked = false;
  informeForm!: FormGroup;
  transporteForm!: FormGroup;
  conjuntosForm: FormGroup[] = [];

  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, private route: ActivatedRoute, private informesService:SharedDataService) {
    this.agregarConjunto();
   }

  ngOnInit() {
    this.initForm();
    this.trasporteForm() ;
    this.route.params.subscribe((params: Params) => {
      const idFromTable = this.informesService.getInformeId();
      console.log('ID recibido:', idFromTable);
      // Aquí puedes usar el id en tu lógica
    });
  }

    // Utiliza un observable para filtrar las ciudades según el texto ingresado en el input
  




  private initForm() {
    this.informeForm = this.formBuilder.group({
      id_informe: ['', Validators.required],
      fecha_salida_informe: ['', Validators.required],
      hora_salida_informe: ['', Validators.required],
      fecha_llegada_informe: ['', Validators.required],
      hora_llegada_informe: ['', Validators.required],
      descripcion_actividades: ['', Validators.required],
      estado_informe: ['Editable', Validators.required]
    });
  }

  private trasporteForm() {
    this.transporteForm = this.formBuilder.group({
      tipo_transporte: ['', Validators.required],
      nombre_transporte: ['', Validators.required],
      ruta: ['', Validators.required],
      fecha_salida_soli: ['', Validators.required],
      hora_salida_soli: ['', Validators.required],
      fecha_llegada_soli: ['', Validators.required],
      hora_llegada_soli: ['', Validators.required],
    });
  }

  enviarInforme() {
    if (this.informeForm.valid) {
      // Aquí puedes enviar los datos del formulario
      console.log(this.informeForm.value);
      // Luego, puedes llamar a un servicio para enviar la solicitud al servidor
      // Ejemplo: this.miServicio.enviarSolicitud(this.solicitudForm.value).subscribe(...);
    } else {
      // Si el formulario no es válido, muestra mensajes de error o realiza las acciones necesarias
    }
  }

  enviarTransporte() {
    if (this.transporteForm.valid) {
      console.log(this.transporteForm.value);
      this.mostrarMensajeConfirmacion2();
    } else {
      // Mostrar mensajes de error o realizar acciones necesarias
    }
  }

  mostrarAlerta() {
    this.snackBar.open('La fecha seleccionada no es válida', 'Cerrar', {
      duration: 5000, // Duración de la notificación en milisegundos
      horizontalPosition: 'center', // Posición horizontal de la notificación
      verticalPosition: 'bottom' // Posición vertical de la notificación
    });
  }
  mostrarMensajeConfirmacion() {
    this.snackBar.open('¡Informe regitrado!', 'Cerrar', {
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
      title: 'Registrar informe',
      text: 'Una vez que lo registres, solo la podrás editar desde tu lista de informes',
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
      title: 'Enviar informe',
      text: 'Una vez enviado el informe, no podrás editarlo.',
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
      title: '¡Informe envíado!',
      text: 'Se ha envíado el informe con éxito, espera la respuesta del administrador',
      icon: 'success', // Utiliza 'success' para mostrar un visto de color verde
      showConfirmButton: false, // Oculta el botón de confirmar
      timer: 5000, // Muestra el mensaje por 5 segundos
    }).then((result) => {
      // Este bloque de then no se ejecutará, ya que no hay botón de confirmar
    });
  }

  verificarFecha(event: any) {
    const fechaSeleccionada = new Date(event.target.value);
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() - 1);

    if (fechaSeleccionada < fechaActual) {
      this.mostrarAlerta()
      event.target.value = ''; // Limpiar la fecha seleccionada
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
      this.enviarInforme();
      this.mostrarMensajeConfirmacion()
      this.botonClicked = true;
    } else {
      console.log("El botón ya fue clickeado");
    }
  }

}