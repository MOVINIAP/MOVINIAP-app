import { Component } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';


@Component({
  selector: 'app-lista-vehiculo',
  templateUrl: './lista-vehiculo.component.html',
  styleUrls: ['./lista-vehiculo.component.scss']
})
export class ListaVehiculoComponent {
  vehiculos: any[] = [];

  constructor(private vehiculosservice: VehiculosService) {}

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  vehiculos12: any[] = [];

  ngOnInit() {
    this.getvehiculos();

  }

  getvehiculos(): void {
    this.vehiculosservice.getvehiculos().subscribe(
      data => {
        this.vehiculos = data;
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
    return 15; // Reemplaza esto con el número real de páginas
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.vehiculos.length / this.itemsPerPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.vehiculos12 = this.vehiculos.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }
}

