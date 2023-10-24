import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
//declare var $: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgIf],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  // this is for the open close
  addExpandClass(element: string) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  // Determine if a sidebar item should be displayed based on user's role
  sidebarnavItemShouldBeDisplayed(sidebarnavItem: RouteInfo): boolean {
    const userRole = this.authService.getIdRol();
    const tokenExists = this.authService.getToken() !== null; // Verifica si el token existe
  
    if (!tokenExists) {
      return false; // No mostrar el elemento si no hay token
    }
  
    if (userRole === '1') {
      return true;
    }
  
    if (userRole === '2') {
      const allowedRoutes = ['/component/ver-informe','/component/realizar-solicitud', '/component/table', '/component/informesPendientes','/component/ver-informes-all','/component/ver-solicitudes-all','/component/realizar-orden','/component/orden-movilizacion'];
      return allowedRoutes.includes(sidebarnavItem.path);
    }
  
    if (userRole === '3') {
      const allowedRoutes = ['/component/ver-informe','/component/realizar-solicitud', '/component/table', '/component/informesPendientes','/component/orden-movilizacion-empleado' ];
      return allowedRoutes.includes(sidebarnavItem.path);
    }
  
    return false;
  }
  

  ngOnInit() {
    
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem =>
     this.sidebarnavItemShouldBeDisplayed(sidebarnavItem)
  );
  }
}
