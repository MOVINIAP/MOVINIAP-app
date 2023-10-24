import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListForByIdService {
  private apiUrl = "http://localhost:3000"; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getSolicitudesPorEmpleado(empleadoId: number): Observable<any> {
    const url = `${this.apiUrl}/solicitudes/empleado/${empleadoId}`;
    return this.http.get(url, {});
  }

  getInformesPorEmpleado(empleadoId: number): Observable<any> {
    const url = `${this.apiUrl}/informes/empleado/${empleadoId}`;
    return this.http.get(url, {});
  }

  getinformesPendientes(empleadoId: number): Observable<any> {
    const url = `${this.apiUrl}/solicitudes/empleado/solicitudes-sin-informe/${empleadoId}`;
    return this.http.get(url, {});
  }

  getDetallePorIDSolicitud(id_solicitud: number): Observable<any> {
    const url = `${this.apiUrl}/solicitudes/${id_solicitud}`;
    return this.http.get(url, {});
  }

  getDetalleSolicitudGenerarPDF(idSolicitud: number): Observable<any> {
    const url = `${this.apiUrl}/solicitudes/${idSolicitud}/generate-pdf`;
    return this.http.get(url, {});
  }

  getDetalleOrdenMovilizacionGenerarPDF(idOrden: number): Observable<any> {
    const url = `${this.apiUrl}/ordenes-movilizacion/${idOrden}`;
    return this.http.get(url, {});
  }
  getDetalleOrdenMovilizacionEmpleado(idEmpleado: number): Observable<any> {
    const url = `${this.apiUrl}/ordenes-movilizacion/empleado/${idEmpleado}`;
    return this.http.get(url, {});
  }


}
