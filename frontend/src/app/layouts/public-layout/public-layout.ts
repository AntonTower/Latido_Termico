import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth'; 

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayoutComponent implements OnInit {
  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  
  isModalOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  loginData = { email: '', password: '' };

  userName: string = 'Usuario';
  userInitials: string = 'US';

  constructor(
    private eRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.extractUserData(token); 
      }
    }
  }

  // 🌟 EXTRAE EL NOMBRE CON SOPORTE PARA ACENTOS Y RED DE SEGURIDAD
  extractUserData(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      
      // Decodificación segura para caracteres latinos (UTF-8)
      const base64Decoded = atob(payloadBase64);
      const safePayload = decodeURIComponent(
        base64Decoded.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      const payload = JSON.parse(safePayload);

      if (payload.usuario && payload.usuario.nombre_completo) {
        // Opción 1: Lo sacamos del Token (Backend actualizado)
        this.userName = payload.usuario.nombre_completo;
      } else {
        // Opción 2: El backend no se actualizó, lo sacamos de la memoria de seguridad
        this.userName = localStorage.getItem('nombre_usuario') || 'Usuario';
      }
    } catch (e) {
      console.error('Error al decodificar el token, usando memoria local.');
      this.userName = localStorage.getItem('nombre_usuario') || 'Usuario';
    }
    this.userInitials = this.getInitials(this.userName);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  toggleMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isUserMenuOpen = false;
  }

  toggleUserMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.hamburger-btn') && !target.closest('.dropdown.main-menu')) {
      this.isMenuOpen = false;
    }
    if (!target.closest('.quick-profile-btn') && !target.closest('.dropdown.user-dropdown')) {
      this.isUserMenuOpen = false;
    }
  }

  doLogout(): void {
    this.authService.logout();
    localStorage.removeItem('nombre_usuario'); // Limpiamos la red de seguridad
    this.isLoggedIn = false;
    this.isUserMenuOpen = false;
    this.router.navigate(['/']);
  }

  openModal(): void {
    this.isModalOpen = true;
    this.errorMessage = '';
    this.showPassword = false;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.loginData = { email: '', password: '' };
    this.errorMessage = '';
    this.showPassword = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  doLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isLoggedIn = true;
        
        // 🛡️ RED DE SEGURIDAD: Guardamos el nombre del JSON de respuesta
        if (res.usuario && res.usuario.nombre) {
          localStorage.setItem('nombre_usuario', res.usuario.nombre);
        }

        this.closeModal();
        window.location.href = '/operaciones'; // Recarga la app fresca
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al conectar con el servidor';
      }
    });
  }

  navigateToRegister(): void {
    this.closeModal();
    this.router.navigate(['/registro']);
  }
}