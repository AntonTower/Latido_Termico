import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// 🌟 CORRECCIÓN 1: La ruta apunta exactamente a tu archivo 'auth.ts'
import { AuthService } from '../../auth/services/auth'; 

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayoutComponent implements OnInit {
  // Controles de Navegación
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  
  // Variables del Modal
  isModalOpen: boolean = false;
  isLoginMode: boolean = true; 
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Modelos de datos
  loginData = { email: '', password: '' };
  registerData = { nombre_completo: '', telefono: '', email: '', password: '', rol_id: 2 };

  constructor(
    private eRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Comprobar si hay sesión activa al cargar la página
    if (typeof window !== 'undefined' && localStorage) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }

  // --- NAVEGACIÓN Y MENÚS ---
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isUserMenuOpen = false; // Cierra el otro menú
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isMenuOpen = false; // Cierra el otro menú
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    // Cierra menú izquierdo si se da clic fuera
    if (!target.closest('.menu-btn') && !target.closest('.dropdown.main-menu')) {
      this.isMenuOpen = false;
    }
    // Cierra menú derecho si se da clic fuera
    if (!target.closest('.user-btn') && !target.closest('.dropdown.user-dropdown')) {
      this.isUserMenuOpen = false;
    }
  }

  // --- SESIÓN ---
  doLogout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isUserMenuOpen = false;
  }

  // --- LÓGICA DEL MODAL ---
  openModal(): void {
    this.isModalOpen = true;
    this.isLoginMode = true; 
    this.resetMessages();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.loginData = { email: '', password: '' };
    this.registerData = { nombre_completo: '', telefono: '', email: '', password: '', rol_id: 2 };
    this.resetMessages();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.resetMessages();
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  doLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.resetMessages();

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      // 🌟 CORRECCIÓN 2: Declaración explícita (res: any) para cumplir con el modo estricto
      next: (res: any) => {
        this.isLoading = false;
        this.isLoggedIn = true; // Activa el icono de usuario en el NAV
        this.closeModal();
      },
      // 🌟 CORRECCIÓN 3: Declaración explícita (err: any)
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al conectar con el servidor';
      }
    });
  }

  doRegister(): void {
    if (!this.registerData.nombre_completo || !this.registerData.telefono || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.isLoading = true;
    this.resetMessages();
    this.registerData.rol_id = Number(this.registerData.rol_id);

    this.authService.register(this.registerData).subscribe({
      // 🌟 CORRECCIÓN 4: Tipado de parámetros de registro
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        setTimeout(() => {
          this.isLoginMode = true;
          this.loginData.email = this.registerData.email;
          this.successMessage = '';
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al registrar el usuario';
      }
    });
  }
}