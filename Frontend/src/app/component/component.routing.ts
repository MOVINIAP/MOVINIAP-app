import { Routes } from '@angular/router';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';

import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { BadgeComponent } from './badge/badge.component';
import { NgbdButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { TableComponent } from './table/table.component';
import { RealizarSolicitudComponent } from './realizar-solicitud/realizar-solicitud.component';
import { RealizarInformeComponent } from './realizar-informe/realizar-informe.component'; 
import { VerInformeComponent } from './ver-informe/ver-informe.component'; 
import { OrdenMovilizacionComponent } from './orden-movilizacion/orden-movilizacion.component'; 
import { RealizarOrdenComponent } from './realizar-orden/realizar-orden.component'; 
import { VerSolicitudesAllComponent } from './ver-solicitudes-all/ver-solicitudes-all.component'; 
import { VerInformesAllComponent } from './ver-informes-all/ver-informes-all.component'; 
import { ListaUsuarioComponent } from './lista-usuario/lista-usuario.component'; 
import { ListaDepartamentoComponent } from './lista-departamento/lista-departamento.component'; 
import { ListaVehiculoComponent } from './lista-vehiculo/lista-vehiculo.component'; 
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearDepartamentoComponent } from './crear-departamento/crear-departamento.component'; 
import { CrearVehiculoComponent } from './crear-vehiculo/crear-vehiculo.component'; 
import { LoginComponent } from './login/login.component';
import { VerSolicitudComponent } from './ver-solicitud/ver-solicitud.component';
import { AuthGuard } from '../guards/auth.guard';
import { InfromesPendientesComponent } from './infromes-pendientes/infromes-pendientes.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'table',
				component: TableComponent
			},
			{
				path: 'informesPendientes',
				component: InfromesPendientesComponent
			},
			{
				path: 'login',
				component: LoginComponent
			},
			{
				path: 'card',
				component: CardsComponent
			},
			{
				path: 'pagination',
				component: NgbdpaginationBasicComponent
			},
			{
				path: 'badges',
				component: BadgeComponent
			},
			{
				path: 'alert',
				component: NgbdAlertBasicComponent
			},
			{
				path: 'dropdown',
				component: NgbdDropdownBasicComponent
			},
			{
				path: 'buttons',
				component: NgbdButtonsComponent
			},
			{
				path: 'realizar-solicitud',
				component: RealizarSolicitudComponent
			},
			{
				path: 'editar-solicitud',
				component: EditSolicitudComponent
			},
			{
				path: 'realizar-informe',
				component: RealizarInformeComponent
			},
			{
				path: 'ver-informe',
				component: VerInformeComponent
			},
			{
				path: 'orden-movilizacion',
				component: OrdenMovilizacionComponent
			},
			{
				path: 'realizar-orden',
				component: RealizarOrdenComponent
			},
			{
				path: 'ver-solicitudes-all',
				component: VerSolicitudesAllComponent,
				//canActivate: [AuthGuard]
			},
			{
				path: 'ver-solicitud',
				component: VerSolicitudComponent,
				//canActivate: [AuthGuard]
			},
			{
				path: 'ver-informes-all',
				component: VerInformesAllComponent
			},
			{
				path: 'lista-usuario',
				component: ListaUsuarioComponent
			},
			{
				path: 'lista-departamento',
				component: ListaDepartamentoComponent
			},
			{
				path: 'lista-vehiculo',
				component: ListaVehiculoComponent
			},
			{
				path: 'crear-usuario',
				component: CrearUsuarioComponent
			},
			{
				path: 'crear-departamento',
				component:  CrearDepartamentoComponent
			},
			{
				path: 'crear-vehiculo',
				component: CrearVehiculoComponent
			},
		]
	}
];
