import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListAllService {
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private authService: AuthService) { }


  getSolicitudes(): Observable<any> {
    // Verifica si el usuario ha cerrado sesión
    if (!this.authService.isLoggedIn()) {
      // Realiza la solicitud HTTP sin el encabezado de autorización
      return this.http.get(`${this.baseUrl}/solicitudes`);
    }
  
    // Obtén el token de autenticación del servicio de autenticación
    const token = this.authService.getToken();
  
    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}` 
    });
  
    // Realiza la solicitud HTTP con el encabezado de autorización
    return this.http.get(`${this.baseUrl}/solicitudes`, { headers });
  }

  getInformes(): Observable<any> {
    // Verifica si el usuario ha cerrado sesión
    if (!this.authService.isLoggedIn()) {
      // Realiza la solicitud HTTP sin el encabezado de autorización
      return this.http.get(`${this.baseUrl}/informes`);
    }
  
    // Obtén el token de autenticación del servicio de autenticación
    const token = this.authService.getToken();
  
    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}` 
    });
  
    // Realiza la solicitud HTTP con el encabezado de autorización
    return this.http.get(`${this.baseUrl}/informes`, { headers });
  }

}
