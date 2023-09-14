import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarDataService {

  private UrlSolicitud = 'http://localhost:3000/solicitudes/nueva-solicitud';
  private UrlTransporte = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Método para realizar la solicitud POST
  registrarSolicitud(data: any): Observable<any> {
    return this.http.post(this.UrlSolicitud, data);
}

registrarTransporte(id_solicitud: number, data: any): Observable<any> {
  const url = `${this.UrlTransporte}/solicitudes/${id_solicitud}/transporte`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post(url, data, { headers: headers });
}
}
