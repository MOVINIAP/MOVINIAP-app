import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ListForByIdService } from 'src/app/services/solicitudes-by-id.service';
import * as pdfMake from 'pdfmake/build/pdfmake'; // Importa pdfMake con el alias "pdfMake"
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Importa vfs_fonts
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Router, ActivatedRoute } from '@angular/router';

interface Transporte {
  tipo_transporte_soli: string;
  nombre_transporte_soli: string;
  ruta_soli: string;
  fecha_salida_soli: string;
  hora_salida_soli: string;
  fecha_llegada_soli: string;
  hora_llegada_soli: string;
  // Otros campos si los tienes
}

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnInit {
  solicitudes: any[] = [];
  pruebita!: String;
  pruebita2!: String;

  solicitudDetalle: any = {};

  idPersona!: number;
  idSolicitud!: number;

  constructor(private solicitudesIDService: ListForByIdService, private authService: AuthService, private sharedDataService: SharedDataService, private router: Router, private route: ActivatedRoute) { }

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

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  solicitudes12: any[] = [];


  ngOnInit() {
    this.getAllSolicitudes();

  }

  generatePDF(idSolicitud: number) {
    this.idSolicitud = idSolicitud;
    this.solicitudesIDService.getDetalleSolicitudGenerarPDF(this.idSolicitud).subscribe(
      async data => {
        this.solicitudDetalle = data;
        console.log("Solicitud");
        console.log(this.solicitudDetalle);
        console.log("Transportes");
        console.log(this.solicitudDetalle.transporte_solicitudes);
        if (this.solicitudDetalle.motivo_movilizacion == "MOVILIZACION") {
          this.pruebita = "X";
          this.pruebita2 = " ";
        } else if (this.solicitudDetalle.motivo_movilizacion == "VIATICOS") {
          this.pruebita = " ";
          this.pruebita2 = "X";
        } else {
          this.pruebita = " ";
          this.pruebita2 = " ";
        }

        const imgBase64Header = await this.loadImageAsBase64("assets/images/bg/encabezado.jpg");
        const imgBase64Footer = await this.loadImageAsBase64('https://upload.wikimedia.org/wikipedia/commons/1/14/INIAP.png');

        const documentDefinition = {
          pageSize: 'A4',
          pageOrientation: 'portrait',
          //margin: [left, top, right, bottom]
          pageMargins: [40, 120, 40, 100],
          //pageMargins: [20, 20, 20, 100],
          info: {
            title: `SOLICITUD-${this.solicitudDetalle.secuencial_solicitud}`,
            author: `${this.solicitudDetalle.empleado}`,
            subject: `SOLICITUD ${this.solicitudDetalle.secuencial_solicitud} ${this.solicitudDetalle.empleado}`,
            creator: `MOVINIAP`,
            producer: `MOVINIAP`,
          },
          header: {
            //image: 'img_header',
            //width: 540, // Ancho de la imagen
            //alignment: 'center', // Alineación centrada
            //margin: [left, top, right, bottom]
            //margin: [10, 10, 10, 10],

            //prueba 2
            columns: [
              {
                //image: 'img_header',
                image: 'img_header',
                //fit: ['540', '540'],
                width: 550,
                height: 110,
                alignment: 'center',
              },
              //{
              //    image: 'img_footer',
              //    fit: ['20%', '20%'],
              //    width: '20%',
              //    alignment: 'right',
              //},
            ],
            // optional space between columns
            // columnGap: 10,
            //margin: [left, top, right, bottom]
            margin: [10, 10, 10, 10],
          },

          footer: function (currentPage: number, pageCount: number, pageSize: number) {
            // you can apply any logic and return any valid pdfmake element
            return [
              ,
              //{ image: 'img_footer', width: 515, height: 75, alignment: 'center' },
              { image: 'img_footer', width: 515, height: 75, alignment: 'center' },
              //margin: [left, top, right, bottom]
              { text: currentPage.toString() + '/' + pageCount, margin: [0, 0, 40, 0], alignment: 'right' }
            ]
          },
          content: [
            {
              style: 'tableExample',
              color: '#444',
              // margin: [0, 92, 0, 0],
              table: {
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  [{ text: 'SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES', style: 'tableHeader', colSpan: 8, alignment: 'center', bold: true, margin: [0, 5], fillColor: '#CCCCCC' }, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: 'Nro. SOLICITUD DE AUTORIZACIÓN PARA CUMPLIMIENTO DE SERVICIOS INSTITUCIONALES', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'FECHA DE SOLICITUD (DD-MM-YYYY)', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],

                  [{ colSpan: 4, text: `${this.solicitudDetalle.secuencial_solicitud}`, alignment: 'center', fontSize: 10 }, '', '', '', { colSpan: 4, text: `${this.solicitudDetalle.fecha_solicitud}`, alignment: 'center', fontSize: 10 }, '', '', ''],

                  [{ text: 'VIÁTICOS', style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: `${this.pruebita2}`, style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: 'MOVILIZACIONES', style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: `${this.pruebita}`, style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: 'SUBSISTENCIAS', style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'ALIMENTACIÓN', style: 'tableHeader', colSpan: 1, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},],

                  [{ text: 'DATOS GENERALES', style: 'tableHeader', colSpan: 8, alignment: 'center', bold: true, margin: [0, 5], fillColor: '#CCCCCC' }, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: 'APELLIDOS - NOMBRES DE LA O EL SERVIDOR', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'PUESTO QUE OCUPA', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],

                  [{ colSpan: 4, text: `${this.solicitudDetalle.empleado}`, alignment: 'center', fontSize: 10 }, '', '', '', { colSpan: 4, text: `${this.solicitudDetalle.cargo}`, alignment: 'center', fontSize: 10 }, '', '', ''],

                  [{ text: 'CIUDAD - PROVINCIA DEL SERVICIO INSTITUCIONAL', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'NOMBRE DE LA UNIDAD A LA QUE PERTENECE LA O EL SERVIDOR', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],
                  [{ colSpan: 4, text: `${this.solicitudDetalle.ciudad_destino} - ${this.solicitudDetalle.provincia_destino}`, alignment: 'center', fontSize: 10 }, '', '', '', { colSpan: 4, text: `${this.solicitudDetalle.unidad}`, alignment: 'center', fontSize: 10 }, '', '', ''],

                  [{ text: 'FECHA SALIDA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'HORA SALIDA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'FECHA LLEGADA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'HORA LLEGADA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {}],

                  [{ text: `${this.solicitudDetalle.fecha_salida}`, alignment: 'center', colSpan: 2, fontSize: 10 },
                  {},
                  { text: `${this.solicitudDetalle.hora_salida}`, alignment: 'center', colSpan: 2, fontSize: 10 },
                  {},
                  { text: `${this.solicitudDetalle.fecha_llegada}`, alignment: 'center', colSpan: 2, fontSize: 10 },
                  {},
                  { text: `${this.solicitudDetalle.hora_llegada}`, alignment: 'center', colSpan: 2, fontSize: 10 }, {}],

                  [{
                    text: [
                      { text: 'SERVIDORES QUE INTEGRAN LOS SERVICIOS INSTITUCIONALES: \n\n', bold: true },
                      { text: `${this.solicitudDetalle.listado_empleados}`, bold: false },
                    ], style: 'tableHeader', colSpan: 8, bold: false, margin: [0, 5], fontSize: 10
                  }, {}, {}, {}, {}, {}, {}, {}],

                  [{
                    text: [
                      { text: 'DESCRIPCIÓN DE LAS ACTIVIDADES A EJECUTARSE: \n\n', bold: true },
                      { text: `${this.solicitudDetalle.descripcion_actividades}`, bold: false },
                    ], style: 'tableHeader', colSpan: 8, bold: false, margin: [0, 5], fontSize: 10
                  }, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: 'TRANSPORTE', style: 'tableHeader', colSpan: 8, alignment: 'center', bold: true, margin: [0, 5], fillColor: '#CCCCCC' }, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: 'TIPO DE TRANSPORTE', style: 'tableHeader', colSpan: 1, rowSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: 'NOMBRE DE TRANSPORTE', style: 'tableHeader', colSpan: 1, rowSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  { text: 'RUTA', style: 'tableHeader', colSpan: 2, alignment: 'center', rowSpan: 2, fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'SALIDA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {},
                  { text: 'LLEGADA', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                  {}],
                  [
                    {}, // Espacio en blanco para RUTA
                    {},
                    {},
                    {},
                    { text: 'FECHA', style: 'tableHeader', alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                    { text: 'HORA', style: 'tableHeader', alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                    { text: 'FECHA', style: 'tableHeader', alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] },
                    { text: 'HORA', style: 'tableHeader', alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }
                  ],
                  ...this.solicitudDetalle.transporte_solicitudes.map((transporte: Transporte) => ([
                    { text: transporte.tipo_transporte_soli, colSpan: 1, alignment: 'center', fontSize: 10, bold: false, margin: [0, 2] },
                    { text: transporte.nombre_transporte_soli, colSpan: 1, alignment: 'center', fontSize: 10, bold: false, margin: [0, 2] },
                    { text: transporte.ruta_soli, colSpan: 2, alignment: 'center', fontSize: 10, margin: [0, 2] },
                    { text: '', colSpan: 1, margin: [0, 2] }, // Espacio en blanco
                    { text: transporte.fecha_salida_soli, colSpan: 1, alignment: 'center', fontSize: 10, margin: [0, 2] },
                    { text: transporte.hora_llegada_soli, colSpan: 1, alignment: 'center', fontSize: 10, margin: [0, 2] },
                    { text: transporte.fecha_llegada_soli, colSpan: 1, alignment: 'center', fontSize: 10, margin: [0, 2] },
                    { text: transporte.hora_llegada_soli, colSpan: 1, alignment: 'center', fontSize: 10, margin: [0, 2] },
                  ])),
                  [{ text: 'DATOS PARA TRANSFERENCIA', style: 'tableHeader', colSpan: 8, alignment: 'center', bold: true, margin: [0, 5], fillColor: '#CCCCCC' }, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: 'NOMBRE DEL BANCO:', style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {},
                  { text: 'TIPO DE CUENTA:', style: 'tableHeader', colSpan: 3, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {},
                  { text: 'No. DE CUENTA:', style: 'tableHeader', colSpan: 3, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}],

                  [{ text: [`${this.solicitudDetalle.nombre_banco}`], style: 'tableHeader', colSpan: 2, alignment: 'center', fontSize: 10, margin: [0, 2] }, {},
                  { text: [`${this.solicitudDetalle.tipo_cuenta}`], style: 'tableHeader', colSpan: 3, alignment: 'center', fontSize: 10, margin: [0, 2] }, {}, {},
                  { text: [`${this.solicitudDetalle.numero_cuenta}`], style: 'tableHeader', colSpan: 3, alignment: 'center', fontSize: 10, margin: [0, 2] }, {}, {}],

                  [{ text: 'FIRMA DE LA O EL SERVIDOR SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'FIRMA DE LA O EL RESPONSABLE DE LA UNIDAD SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],
                  [{ colSpan: 4, text: '\n\n\n\n\n', alignment: 'center', fontSize: 10, }, '', '', '',
                  { colSpan: 4, text: '', alignment: 'center', fontSize: 10, }, '', '', ''],
                  [{ text: 'NOMBRES COMPLETOS Y CARGO DE LA O EL SERVIDOR', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'NOMBRES COMPLETOS Y CARGO  DE LA O EL RESPONSABLE DE LA UNIDAD SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],

                  [
                    { text: 'FIRMA DE LA O EL SERVIDOR SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                    { text: 'FIRMA DE LA O EL RESPONSABLE DE LA UNIDAD SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],
                  [{ colSpan: 4, text: '\n\n\n\n\n', alignment: 'center', fontSize: 10, }, '', '', '',
                  { colSpan: 4, text: '', alignment: 'center', fontSize: 10, }, '', '', ''],
                  [{ text: 'NOMBRES COMPLETOS Y CARGO DE LA O EL SERVIDOR', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {},
                  { text: 'NOMBRES COMPLETOS Y CARGO  DE LA O EL RESPONSABLE DE LA UNIDAD SOLICITANTE', style: 'tableHeader', colSpan: 4, alignment: 'center', fontSize: 10, bold: true, margin: [0, 2] }, {}, {}, {}],

                ]
              },
            },
          ],
          images: {
            img_header: imgBase64Header,
            img_footer: imgBase64Footer,

          }
        };
        // Abrir PDF en el Navegador
        (pdfMake as any).createPdf(documentDefinition).open();

        // Descargar PDF directamente con nombre personalizado
        //(pdfMake as any).createPdf(documentDefinition).download(`SOLICITUD-${this.solicitudDeatil.secuencial_solicitud}`);

      }, error => {
        console.error(error);
      }
    );
  }

  getAllSolicitudes(): void {
    const idPersona1 = this.authService.getIdEmpleadoFromToken();
    this.idPersona = parseInt(idPersona1!, 10);
    console.log(this.idPersona);
    this.solicitudesIDService.getSolicitudesPorEmpleado(this.idPersona).subscribe(
      data => {
        this.solicitudes = data;
        this.calculateTotalPages();
        this.updateDisplayedData();
      }, error => {
        console.error(error);
      }
    );
  }

  editarSolicitud(id: number) {
    this.sharedDataService.setSolicitudId(id);
    this.router.navigate(['../editar-solicitud'], { relativeTo: this.route });
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
    this.totalPages = Math.ceil(this.solicitudes.length / this.itemsPerPage);
  }

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.solicitudes12 = this.solicitudes.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }



}
