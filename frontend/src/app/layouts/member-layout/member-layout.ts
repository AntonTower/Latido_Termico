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

  // 🌟 EXTRAE NOMBRE, INICIALES Y ROL CON SOPORTE UTF-8 Y RED DE SEGURIDAD
  extractUserData(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      
      // Decodificación segura para caracteres latinos (UTF-8)
      const base64Decoded = atob(payloadBase64);
      const safePayload = decodeURIComponent(
        base64Decoded.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      const payload = JSON.parse(safePayload);

      // 1. Extraer el Nombre
      if (payload.usuario && payload.usuario.nombre_completo) {
        this.userName = payload.usuario.nombre_completo;
      } else {
        this.userName = localStorage.getItem('nombre_usuario') || 'Usuario';
      }

      // 2. Extraer el Rol (El backend manda rol_id: 1=Reportante, 2=Voluntario)
      let rolName: RolUsuario = 'REPORTANTE'; // Por defecto
      const rolId = payload.usuario?.rol_id;

      if (rolId === 1) rolName = 'REPORTANTE';
      else if (rolId === 2) rolName = 'VOLUNTARIO';
      else if (rolId === 3) rolName = 'PATROCINADOR';
      else if (rolId === 4) rolName = 'SUPERADMIN';

      if (rolName in this.roleConfig) {
        this.userRole = rolName;
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
    localStorage.removeItem('nombre_usuario'); // 🧹 Limpiamos la red de seguridad al salir
    window.location.href = '/';
  }
}