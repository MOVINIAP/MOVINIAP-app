import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';
  idUsuario!: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedDataService
    ) {}

    login(): void {
      if (this.username && this.password) {
        
        this.authService.login({ usuario: this.username, contrasenia: this.password })
          .subscribe(
            (response) => {
              // Maneja la respuesta exitosa
              console.log("Respuesta exitosa:", response);
              // Muestra un SweetAlert de éxito
              Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: '¡Bienvenido!',
                timer: 2000, // Duración en milisegundos (opcional)
                showConfirmButton: false
              }).then(() => {
                // Redirige a la ruta protegida
                this.router.navigate(['/ver-solicitud']);
                const idPersona = this.authService.getIdEmpleadoFromToken();
                const idPersona_number=parseInt(idPersona!,10);
                this.idUsuario = idPersona_number;
                if (this.idUsuario) {
                  this.sharedDataService.setIdPersona(this.idUsuario);
                  console.log(this.idUsuario);
                 }
              });
    
            },
            (error) => {
              // Maneja el error
              this.loginError = 'Credenciales inválidas'; // Mostrar mensaje de error
    
              // Muestra un SweetAlert de error
              Swal.fire({
                icon: 'error',
                title: 'Error en el inicio de sesión',
                text: 'Credenciales inválidas',
                confirmButtonText: 'OK'
              });
            }
          );
      } else {
        this.loginError = "Por favor ingresa usuario y contraseña";
      }
    }
    
}
