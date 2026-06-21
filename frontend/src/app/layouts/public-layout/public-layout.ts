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

  // Estado para la visibilidad de la contraseña
  showPassword: boolean = false;

  loginData = { email: '', password: '' };

  constructor(
    private eRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && localStorage) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isUserMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-btn') && !target.closest('.dropdown.main-menu')) {
      this.isMenuOpen = false;
    }
    if (!target.closest('.user-btn') && !target.closest('.dropdown.user-dropdown')) {
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
    this.showPassword = false; // Ocultar contraseña al abrir
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.loginData = { email: '', password: '' };
    this.errorMessage = '';
    this.showPassword = false; // Ocultar contraseña al cerrar
  }

  // Alternar vista de contraseña
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