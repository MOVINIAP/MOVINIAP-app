import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { RealizarSolicitudComponent } from './component/realizar-solicitud/realizar-solicitud.component';
import { AuthGuard } from './guards/auth.guard';
import { VerSolicitudesAllComponent } from './component/ver-solicitudes-all/ver-solicitudes-all.component';
import { TableComponent } from './component/table/table.component';
import { VerSolicitudComponent } from './component/ver-solicitud/ver-solicitud.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/ver-solicitud', pathMatch: 'full' },
      {
        path: 'table',
        component: TableComponent,
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'realizar-solicitud',
        component: RealizarSolicitudComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'ver-solicitudes-All',
        component: VerSolicitudesAllComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'ver-solicitud',
        component: VerSolicitudComponent,
        canActivate: [AuthGuard] 
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/component/login'
  }
];
