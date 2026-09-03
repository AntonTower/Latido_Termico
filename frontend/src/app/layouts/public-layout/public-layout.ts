import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../auth/services/auth';

type RolUsuario = 'REPORTANTE' | 'VOLUNTARIO' | 'PATROCINADOR' | 'SUPERADMIN';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule], 
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayoutComponent implements OnInit {
  isMenuOpen: boolean = false;       // Menú hamburguesa móvil
  isUserMenuOpen: boolean = false;   // Menú de usuario desplegable
  isSidebarOpen: boolean = false;
  isModalOpen: boolean = false;      // Modal de login público

  isLoggedIn: boolean = false;

  userName: string = 'Usuario';
  userInitials: string = 'US';
  userRole: RolUsuario = 'VOLUNTARIO';

  readonly roleConfig: Record<RolUsuario, { class: string }> = {
    REPORTANTE:   { class: 'role-reportante'   },
    VOLUNTARIO:   { class: 'role-voluntario'   },
    PATROCINADOR: { class: 'role-patrocinador' },
    SUPERADMIN:   { class: 'role-superadmin'   },
  };

  loginData = {
    email: '',
    password: ''
  };
  isLoading: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.extractUserData(token);
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  openModal(): void {
    this.isModalOpen = true;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  navigateToRegister(): void {
    this.closeModal();
    this.router.navigate(['/registro']);
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
        this.isLoggedIn = true;
        this.closeModal();

        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        const usuarioLogueado = res.usuario || res.user || res;
        localStorage.setItem('user', JSON.stringify(usuarioLogueado));
        if (usuarioLogueado.nombre_completo) {
          localStorage.setItem('nombre_usuario', usuarioLogueado.nombre_completo);
        }

        const rolId = Number(usuarioLogueado.rol_id || usuarioLogueado.id_rol);

        if (rolId === 3) {
          console.log('¡Inicio de sesión exitoso como Patrocinador!');
          window.location.replace('/operaciones/patrocinador');
        } else {
          console.log('Inicio de sesión estándar. Redirigiendo a operaciones...');
          window.location.replace('/operaciones');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Credenciales incorrectas';
      }
    });
  }

  extractUserData(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      const base64Decoded = atob(payloadBase64);
      const safePayload = decodeURIComponent(
        base64Decoded.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      const payload = JSON.parse(safePayload);

      // Nombre del usuario
      if (payload.usuario && payload.usuario.nombre_completo) {
        this.userName = payload.usuario.nombre_completo;
      } else {
        this.userName = localStorage.getItem('nombre_usuario') || 'Usuario';
      }

      // Rol
      let rolName: RolUsuario = 'REPORTANTE';
      const rolId = payload.usuario?.rol_id;

      if (rolId === 1) rolName = 'REPORTANTE';
      else if (rolId === 2) rolName = 'VOLUNTARIO';
      else if (rolId === 3) rolName = 'PATROCINADOR';
      else if (rolId === 4) rolName = 'SUPERADMIN';

      if (rolName in this.roleConfig) {
        this.userRole = rolName;
      }

      if (rolName === 'PATROCINADOR' && window.location.pathname.startsWith('/operaciones')) {
        this.router.navigate(['/operaciones/patrocinador']);
      }
      
    } catch (e) {
      console.error('Error al decodificar token en el layout público:', e);
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

  doLogout(): void {
    this.authService.logout();
    localStorage.clear();
    this.isLoggedIn = false;
    window.location.href = '/';
  }
}