import { Component } from '@angular/core';
import { ListAllService } from 'src/app/services/solicitudes-all.service'; // Asegúrate de importar correctamente tu servicio


@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.scss']
})
export class ListaUsuarioComponent {
  usuarios: any[] = [];

  constructor(private usuariosService: ListAllService) {}

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  usuarios12: any[] = [];

  ngOnInit() {
    this.getAllUsuarios();

  }

  //Cambiar funcion para usuarios
  getAllUsuarios(): void {
    this.usuariosService.getSolicitudes().subscribe(
      data => {
        this.usuarios = data;
        this.calculateTotalPages();
        this.updateDisplayedData();
      }, error => {
        console.error(error);
      }
    );
  }
  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    return 10;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.usuarios.length / this.itemsPerPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.usuarios12 = this.usuarios.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }
}
