import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

type RolUsuario = 'REPORTANTE' | 'VOLUNTARIO' | 'PATROCINADOR' | 'SUPERADMIN';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './member-layout.html',
  styleUrls: ['./member-layout.css']
})
export class MemberLayoutComponent implements OnInit {
  isUserMenuOpen: boolean = false;
  isSidebarOpen: boolean = false; // 🌟 único estado: panel desplegable, igual en PC y móvil

  userName: string = 'Usuario';
  userInitials: string = 'US';
  userRole: RolUsuario = 'VOLUNTARIO';

  private readonly roleConfig: Record<RolUsuario, { class: string }> = {
    REPORTANTE:   { class: 'role-reportante'   },
    VOLUNTARIO:   { class: 'role-voluntario'   },
    PATROCINADOR: { class: 'role-patrocinador' },
    SUPERADMIN:   { class: 'role-superadmin'   },
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/']);
      } else {
        this.extractUserData(token);
      }
    }
  }

  // 🌟 EXTRAE NOMBRE, INICIALES Y ROL DEL TOKEN JWT — sin placeholders fijos
  extractUserData(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));

      if (payload.nombre_completo) {
        this.userName = payload.nombre_completo;
      } else if (payload.email) {
        this.userName = payload.email.split('@')[0];
      }

      const rolCrudo: string = (payload.rol || payload.role || '').toString().toUpperCase();
      if (rolCrudo in this.roleConfig) {
        this.userRole = rolCrudo as RolUsuario;
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

  get roleClass(): string {
    return this.roleConfig[this.userRole].class;
  }

  get roleLabel(): string {
    return this.userRole;
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isSidebarOpen = false; // 🌟 sólo un panel abierto a la vez
  }

  // 🌟 El menú lateral ahora se comporta exactamente como el dropdown de usuario
  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isUserMenuOpen = false;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.member-dropdown') && !target.closest('.quick-profile-btn')) {
      this.isUserMenuOpen = false;
    }

    if (!target.closest('.sidebar-dropdown') && !target.closest('.hamburger-btn')) {
      this.isSidebarOpen = false;
    }
  }

  doLogout(): void {
    this.authService.logout();
    window.location.href = '/';
  }
}