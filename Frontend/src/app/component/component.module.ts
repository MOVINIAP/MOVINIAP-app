import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';
import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { TableComponent } from "./table/table.component";
import { VerSolicitudComponent } from './ver-solicitud/ver-solicitud.component';
import { RealizarSolicitudComponent } from './realizar-solicitud/realizar-solicitud.component';
import { VerInformeComponent } from './ver-informe/ver-informe.component';
import { RealizarInformeComponent } from './realizar-informe/realizar-informe.component';
import { OrdenMovilizacionComponent } from './orden-movilizacion/orden-movilizacion.component';
import { RealizarOrdenComponent } from './realizar-orden/realizar-orden.component';
import { VerSolicitudesAllComponent } from './ver-solicitudes-all/ver-solicitudes-all.component';
import { VerInformesAllComponent } from './ver-informes-all/ver-informes-all.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { ListaUsuarioComponent } from './lista-usuario/lista-usuario.component';
import { CrearVehiculoComponent } from './crear-vehiculo/crear-vehiculo.component';
import { ListaVehiculoComponent } from './lista-vehiculo/lista-vehiculo.component';
import { CrearDepartamentoComponent } from './crear-departamento/crear-departamento.component';
import { ListaDepartamentoComponent } from './lista-departamento/lista-departamento.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogoconfirmacionComponent } from './dialogoconfirmacion/dialogoconfirmacion.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { LoginComponent } from './login/login.component';
import { InfromesPendientesComponent } from './infromes-pendientes/infromes-pendientes.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';
import { OrdenMovilizacionEmpleadoComponent } from './orden-movilizacion-empleado/orden-movilizacion-empleado.component';
import { EditarOrdenMovilizacionComponent } from './editar-orden-movilizacion/editar-orden-movilizacion.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbdpaginationBasicComponent,
    NgbdAlertBasicComponent,
    NgbdDropdownBasicComponent,
    NgbdButtonsComponent,
    CardsComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule
  ],
  declarations: [
    VerSolicitudComponent,
    RealizarSolicitudComponent,
    VerInformeComponent,
    RealizarInformeComponent,
    OrdenMovilizacionComponent,
    RealizarOrdenComponent,
    VerSolicitudesAllComponent,
    VerInformesAllComponent,
    CrearUsuarioComponent,
    ListaUsuarioComponent,
    CrearVehiculoComponent,
    ListaVehiculoComponent,
    CrearDepartamentoComponent,
    ListaDepartamentoComponent,
    DialogoconfirmacionComponent,
    TableComponent,
    LoginComponent,
    InfromesPendientesComponent,
    EditSolicitudComponent,
    OrdenMovilizacionEmpleadoComponent,
    EditarOrdenMovilizacionComponent
  ],
})
export class ComponentsModule { }
