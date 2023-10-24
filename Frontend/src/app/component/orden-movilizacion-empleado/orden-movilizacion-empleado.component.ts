import { Component } from '@angular/core';
import { ListAllService } from 'src/app/services/solicitudes-all.service'; // Asegúrate de importar correctamente tu servicio
import * as pdfMake from 'pdfmake/build/pdfmake'; // Importa pdfMake con el alias "pdfMake"
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Importa vfs_fonts
import { ListForByIdService } from 'src/app/services/solicitudes-by-id.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-orden-movilizacion-empleado',
  templateUrl: './orden-movilizacion-empleado.component.html',
  styleUrls: ['./orden-movilizacion-empleado.component.scss']
})
export class OrdenMovilizacionEmpleadoComponent {
  ordenes: any[] = [];
  idOrden!: number;
  ordenDetalle: any = {};
  idEmpleado!: number;

  constructor(private ordenService: ListAllService, private ordenesIDService: ListForByIdService, private authService: AuthService
    , ) {}

  currentPage = 1;
  itemsPerPage = 5; 
  totalPages = 1;

  ordenes12: any[] = [];


  ngOnInit() {
    this.getOrdenesByEmpleado();

  }

  getOrdenesByEmpleado(): void {
    const idEmpleado1 = this.authService.getIdEmpleadoFromToken();
    this.idEmpleado = parseInt(idEmpleado1!, 10);
    console.log(this.idEmpleado);
    this.ordenesIDService.getDetalleOrdenMovilizacionEmpleado(this.idEmpleado).subscribe(
      data => {
        this.ordenes = data;
        this.calculateTotalPages();
        this.updateDisplayedData();
      }, error => {
        console.error(error);
      }
    );
  }
  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages(); // Implementa la función getTotalPages() para obtener el número total de páginas
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Implementa la función getTotalPages() para obtener el número total de páginas
  getTotalPages(): number {
    // Cálculo para obtener el número total de páginas (depende de cómo estés manejando la paginación)
    return 10; // Reemplaza esto con el número real de páginas
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.ordenes.length / this.itemsPerPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.ordenes12 = this.ordenes.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }
}
