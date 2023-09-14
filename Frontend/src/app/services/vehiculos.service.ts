import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private authService: AuthService) { }


  getvehiculos(): Observable<any> {
    // Verifica si el usuario ha cerrado sesión
    if (!this.authService.isLoggedIn()) {
      // Realiza la solicitud HTTP sin el encabezado de autorización
      return this.http.get(`${this.baseUrl}/vehiculos`);
    }
  
    // Obtén el token de autenticación del servicio de autenticación
    const token = this.authService.getToken();
  
    // Configura el encabezado de autorización con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
  
    // Realiza la solicitud HTTP con el encabezado de autorización
    return this.http.get(`${this.baseUrl}/vehiculos`, { headers });
  }
}
