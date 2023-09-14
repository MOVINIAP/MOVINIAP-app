import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log('Token almacenado:', token); // Agregar esta línea
  }
  
  getIdPersonaFromToken(): string | null {
    const token = this.getToken();
    // Decodifica el token para obtener el idpersona (esto puede variar dependiendo de cómo se almacena el idpersona en el token)
    // Supongamos que el idpersona está en el campo 'id' del token decodificado
    const decodedToken: any = jwt_decode(token!);
    return decodedToken.id_usuario || null;
  }

  getIdEmpleadoFromToken(): string | null {
    const token = this.getToken();
    // Decodifica el token para obtener el idpersona (esto puede variar dependiendo de cómo se almacena el idpersona en el token)
    // Supongamos que el idpersona está en el campo 'id' del token decodificado
    const decodedToken: any = jwt_decode(token!);
    return decodedToken.id_empleado || null;
  }

  getIdRol(): string | null {
    const token = this.getToken();
    // Decodifica el token para obtener el idpersona (esto puede variar dependiendo de cómo se almacena el idpersona en el token)
    // Supongamos que el idpersona está en el campo 'id' del token decodificado
    const decodedToken: any = jwt_decode(token!);
    return decodedToken.id_rol || null;
  }


  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  private removeToken(): void {
    localStorage.removeItem('token');
  }

  login(credentials: { usuario: string, contrasenia: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials)
    .pipe(
      tap(response => {
        if (response.token) {
          // Almacena el token en localStorage o sessionStorage
          this.setToken(response.token);
        }
        else{
          console.log("No existe token");
        }
      } 
      )
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  // Agrega más métodos aquí, como el cierre de sesión y almacenamiento de token
  // auth.service.ts
  logout(): void {
    this.removeToken();
    console.log('Token eliminado:', this.getToken()); // Verifica si el token se elimina correctamente
    // ... otros pasos de cierre de sesión
  }

  isLoggedIn(): boolean {
    // Verifica si el token está presente en el localStorage o sessionStorage
    return !!this.getToken();
  }

}

