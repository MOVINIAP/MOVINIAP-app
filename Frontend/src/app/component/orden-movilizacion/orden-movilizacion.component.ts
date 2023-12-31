import { Component } from '@angular/core';
import { ListAllService } from 'src/app/services/solicitudes-all.service'; // Asegúrate de importar correctamente tu servicio
import * as pdfMake from 'pdfmake/build/pdfmake'; // Importa pdfMake con el alias "pdfMake"
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Importa vfs_fonts
import { ListForByIdService } from 'src/app/services/solicitudes-by-id.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orden-movilizacion',
  templateUrl: './orden-movilizacion.component.html',
  styleUrls: ['./orden-movilizacion.component.scss']
})
export class OrdenMovilizacionComponent {
  ordenes: any[] = [];
  idOrden!: number;
  ordenDetalle: any = {};

  constructor(private ordenService: ListAllService, private ordenesIDService: ListForByIdService, private sharedDataService: SharedDataService, private router: Router, private route: ActivatedRoute) { }

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  ordenes12: any[] = [];

  async formatSecuencial(sequencial: string): Promise<string> {
    const maxLength = 7; // Máxima longitud deseada
    const filledWithZeros = '0'.repeat(maxLength - sequencial.length);
    return filledWithZeros + sequencial;
  }

  async loadImageAsBase64(url: string): Promise<string> {
    try {
      // Utilizamos Fetch para descargar la imagen
      const response = await fetch(url);
      const blob = await response.blob(); // Convertir la respuesta en un blob
      const reader = new FileReader();

      return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64data = reader.result as string;
          resolve(base64data); // Devolver la URL base64 generada
        };

        reader.onerror = (error) => {
          reject(error); // Manejar errores de lectura
        };

        // Leer el blob como una URL base64
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(`Error al descargar la imagen: ${error}`);
    }
  }


  ngOnInit() {
    this.getAllOrdenes();

  }

  generatePDF(idOrden: number) {
    this.idOrden = idOrden;
    this.ordenesIDService.getDetalleOrdenMovilizacionGenerarPDF(this.idOrden).subscribe(
      async data => {
        this.ordenDetalle = data;

        const imgBase64Header = await this.loadImageAsBase64("assets/images/bg/ordenfinal.png");
        const formattedSecuencial: string = await this.formatSecuencial(this.ordenDetalle.secuencial);

        const documentDefinition = {
          pageSize: 'A5',
          pageOrientation: 'landscape',
          pageMargins: [25, 40, 25, 10],
          info: {
            title: `ORDEN DE MOVILIZACION No ${formattedSecuencial}`,
            author: `${this.ordenDetalle.empleado_emisor}`,
            subject: `Orden de movilizacion ${formattedSecuencial}`,
            creator: `MOVINIAP`,
            producer: `MOVINIAP`,
          },
          header: {
            columns: [
              {
                image: 'img_header',
                width: 540,
                height: 40,
                alignment: 'center',
              },
            ],
            margin: [10, 10, 10, 10],
          },
          content: [
            // inicio content
            // 'Primer parrafo',
            // 'Otro párrafo, esta vez un poco más largo para asegurarnos, esta línea se dividirá en al menos dos líneas',
            {
              // layout: '', // optional
              style: 'tableStyle',
              color: '#0f13ac',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: ['*', '*'],
                margin: [25, 70, 25, 10],

                body:
                  // inicio body
                  [
                    // Header row
                    // header row init
                    [
                      {
                        // border: [izquierda, arriba, derecha, abajo],
                        // border: [false, false, false, true],
                        border: [false, false, false, false],
                        text:
                          [
                            { text: `${formattedSecuencial}`, style: 'tableHeader', alignment: 'right', bold: true, color: 'red', fontSize: 20 },
                            { text: ' /2023', style: 'tableHeader', alignment: 'right', bold: true, color: 'blue', fontSize: 20 },
                          ],
                        colSpan: 2,
                      },
                      {
                      }
                    ],
                    // header row end

                    //1st row init
                    [
                      //1st row, 1st column
                      {
                        text: [
                          { text: 'Lugar, fecha y hora de emisión de la orden:\n', bold: true },
                          { text: `${this.ordenDetalle.ciudad_origen}, ${this.ordenDetalle.fecha_hora_emision}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //1st row, 2nd colum
                      {
                        text: [
                          { text: 'Marca/Tipo:\n', bold: true },
                          { text: `${this.ordenDetalle.marca}/${this.ordenDetalle.tipo_vehiculo}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                    ],
                    //1st row end

                    //2nd row
                    //2nd row init
                    [
                      //2nd row, 1st column
                      {
                        text: [
                          { text: 'Motivo de la movilizacion: ', bold: true },
                          { text: `${this.ordenDetalle.descripcion_actividades}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //2nd row, 2nd colum
                      {
                        text: [
                          { text: 'Color: ', bold: true },
                          { text: `${this.ordenDetalle.color_primario}`, color: 'black' },
                        ],
                        style: 'small',
                      }
                    ],
                    //2nd row end

                    //3rd row
                    //3rd row init
                    [
                      //3rd row, 1st column
                      {
                        text: [
                          { text: 'Lugar de origen y de destino: \n', bold: true },
                          { text: `${this.ordenDetalle.ciudad_origen} - ${this.ordenDetalle.ciudad_destino}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //3rd row, 2nd colum
                      {
                        text: [
                          { text: 'Placa No: ', bold: true },
                          { text: `${this.ordenDetalle.placa_vehiculo}`, color: 'black' },
                        ],
                        style: 'small',
                      }
                    ],
                    //3rd row end

                    //4th row
                    //4th row init
                    [
                      //4th row, 1st column
                      {
                        text: [
                          { text: 'Tiempo de duración de la comisión: \n', bold: true },
                          { text: `DESDE: `, color: 'black', bold: true },
                          { text: `${this.ordenDetalle.fecha_desde} ${this.ordenDetalle.hora_desde}`, color: 'black' },
                          { text: `\t`, color: 'black' },
                          { text: `HASTA: `, color: 'black', bold: true },
                          { text: `${this.ordenDetalle.fecha_hasta} ${this.ordenDetalle.hora_hasta}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //4th row, 2nd colum
                      {
                        text: [
                          { text: 'Matricula No: ', bold: true },
                          { text: `${this.ordenDetalle.numero_matricula}`, color: 'black' },
                        ],
                        style: 'small',
                      }
                    ],
                    //4th row end

                    //5th row
                    //5th row init
                    [
                      //5th row, 1st column
                      {
                        text: [
                          { text: 'Nombres y apellidos del conductor: \n', bold: true },
                          { text: `${this.ordenDetalle.empleado_conductor}`, color: 'black' },
                          { text: `\n`, color: 'black' },
                          { text: `No de cédula de ciudadanía: `, color: '#0f13ac', bold: true },
                          { text: `${this.ordenDetalle.cedula_conductor}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //5th row, 2nd colum
                      {
                        text: [
                          { text: 'Motor No: ', bold: true },
                          { text: `${this.ordenDetalle.numero_motor}`, color: 'black' },
                        ],
                        style: 'small',
                      }
                    ],
                    //5th row end

                    //6th row
                    //6th row init
                    [
                      //6th row, 1st column
                      {
                        text: [
                          { text: 'Nombres y apellidos del funcionario: \n', bold: true },
                          { text: `${this.ordenDetalle.empleado_solicitante}`, color: 'black' },
                          { text: `\n`, color: 'black' },
                          { text: `No de cédula de ciudadanía: `, color: '#0f13ac', bold: true },
                          { text: `${this.ordenDetalle.cedula_solicitante}`, color: 'black' },
                        ],
                        style: 'small',
                      },
                      //6th row, 2nd colum
                      {
                        text: [
                          { text: 'Año: ', bold: true },
                          { text: `${this.ordenDetalle.anio_fabricacion}`, color: 'black' },
                        ],
                        style: 'small',
                      }
                    ],
                    //6th row end

                    // 7th row (final row) or footer
                    //6th row init
                    [
                      //6th row, 1st column
                      {
                        border: [false, false, false, false],
                        text: [
                          { text: 'Acompañantes: \n', bold: true, alignment: 'justify' },
                          { text: `${this.ordenDetalle.listado_acompanantes}`, color: 'black', alignment: 'justify' }
                        ],
                        style: 'small',
                      },
                      //6th row, 2nd colum
                      {
                        border: [false, false, false, false],
                        text: [
                          { text: '\n', },
                          { text: `\n`, },
                          { text: '\n', },
                          { text: `\n`, },
                          { text: '\n', },
                          { text: '\n', },
                          { text: '______________________________________________', bold: true, alignment: 'center' },
                          { text: '\n', bold: true },
                          { text: `${this.ordenDetalle.empleado_emisor}`, bold: true, alignment: 'center' },
                          { text: '\n', bold: true },
                          { text: `C.C.: `, bold: true, alignment: 'center' },
                          { text: `${this.ordenDetalle.cedula_emisor}`, bold: true, alignment: 'center' },
                          { text: '\n', bold: true },
                          { text: 'FIRMA AUTORIZADA', bold: true, alignment: 'center' },
                        ],
                        style: 'small',
                      }
                    ],
                    //6th row end


                    // fin body
                  ],
              }
              // fin content      
            }
          ],
          // end content
          styles: {
            small: {
              fontSize: 10
            },
          },
          images: {
            img_header: imgBase64Header,
            img_header_backup: 'data:image/png;base64,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'
          }
        };

        (pdfMake as any).createPdf(documentDefinition).open();
      }, (error: any) => {
        console.error(error);
      }
    );
  }

  editarOrden(id: number) {
    this.sharedDataService.setOrdenId(id);
    this.router.navigate(['../editar-orden-movilizacion'], { relativeTo: this.route });
  }



  getAllOrdenes(): void {
    this.ordenService.getOrdenes().subscribe(
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
