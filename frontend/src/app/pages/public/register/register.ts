import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  // Estado de la interfaz
  isLoginMode: boolean = false; // Comienza en registro porque la ruta es /registro
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Modelos de datos
  loginData = { email: '', password: '' };
  registerData = { nombre_completo: '', telefono: '', email: '', password: '', rol_id: 2 };

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  doLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        // 
        alert("Respuesta del servidor: " + JSON.stringify(res));

        let rolId: number | null = null;

        if (res) {
          if (res.rol_id) rolId = Number(res.rol_id);
          else if (res.id_rol) rolId = Number(res.id_rol);
          else if (res.usuario && res.usuario.rol_id) rolId = Number(res.usuario.rol_id);
          else if (res.usuario && res.usuario.id_rol) rolId = Number(res.usuario.id_rol);
          else if (res.user && res.user.rol_id) rolId = Number(res.user.rol_id);
        }

        // Alerta secundaria para ver qué rol procesó Angular
        alert("Rol detectado por Angular: " + rolId);

        if (rolId === 3) {
          window.location.href = '/patrocinador';
        } else {
          window.location.href = '/operaciones';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Credenciales incorrectas';
      }
    });
  }
  doRegister(): void {
    if (!this.registerData.nombre_completo || !this.registerData.telefono || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.registerData.rol_id = Number(this.registerData.rol_id);

    this.authService.register(this.registerData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = '¡Cuenta creada! Cambiando a inicio de sesión...';
        
        // Transición automática al login después de registrarse
        setTimeout(() => {
          this.loginData.email = this.registerData.email;
          this.toggleMode();
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al registrar el usuario';
      }
    });
  }
}