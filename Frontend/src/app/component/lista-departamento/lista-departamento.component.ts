import { Component } from '@angular/core';
import { ListAllService } from 'src/app/services/solicitudes-all.service'; // Asegúrate de importar correctamente tu servicio


@Component({
  selector: 'app-lista-departamento',
  templateUrl: './lista-departamento.component.html',
  styleUrls: ['./lista-departamento.component.scss']
})
export class ListaDepartamentoComponent {
  departamentos: any[] = [];

  constructor(private departamentosService: ListAllService) {}

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  departamentos12: any[] = [];

  ngOnInit() {
    this.getAllSolicitudes();

  }
//Cmabiar funcion para traer departamentos
  getAllSolicitudes(): void {
    this.departamentosService.getSolicitudes().subscribe(
      data => {
        this.departamentos = data;
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
    this.totalPages = Math.ceil(this.departamentos.length / this.itemsPerPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.departamentos12 = this.departamentos.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }
}

