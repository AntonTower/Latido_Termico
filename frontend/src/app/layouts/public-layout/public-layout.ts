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
        this.extractUserData(token); // 🌟 Extrae el nombre directamente del token
      }
    }
  }

  // 🌟 Decodificador del JWT
  extractUserData(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.usuario && payload.usuario.nombre_completo) {
        this.userName = payload.usuario.nombre_completo;
      }
    } catch (e) {
      console.error('No se pudo decodificar el usuario del token.');
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
        this.closeModal();
        window.location.href = '/operaciones';
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