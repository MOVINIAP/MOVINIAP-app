import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface ICiudad {
  id_ciudad: string,
  ciudad: string,
  id_provincia: string,
 }

@Injectable({
  providedIn: 'root'
})
export class listCBX {
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private authService: AuthService) { }


  getCiudades(): Observable<any> {
    // Verifica si el usuario ha cerrado sesión
    if (!this.authService.isLoggedIn()) {
      // Realiza la solicitud HTTP sin el encabezado de autorización
      return this.http.get(`${this.baseUrl}/ciudades`);
    }
  
    // Obtén el token de autenticación del servicio de autenticación
    const token = this.authService.getToken();
  
    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}` 
    });
  
    // Realiza la solicitud HTTP con el encabezado de autorización
    return this.http.get(`${this.baseUrl}/ciudades`, { headers });
  }

  getEmpleados(): Observable<any> {
    // Verifica si el usuario ha cerrado sesión
    if (!this.authService.isLoggedIn()) {
      // Realiza la solicitud HTTP sin el encabezado de autorización
      return this.http.get(`${this.baseUrl}/empleados`);
    }
  
    // Obtén el token de autenticación del servicio de autenticación
    const token = this.authService.getToken();
  
    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}` 
    });
  
    // Realiza la solicitud HTTP con el encabezado de autorización
    return this.http.get(`${this.baseUrl}/empleados`, { headers });
  }

  

}

