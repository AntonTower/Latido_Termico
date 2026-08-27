import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {
  currentStep: 'intro' | 'roles' | 'register' = 'intro';

  // Rol elegido en el paso "roles" exclusiivo para voluntario y patrocinador
  selectedRoleId: number = 2;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerData = {
    nombre_completo: '',
    telefono: '',
    email: '',
    password: '',
    rol_id: 2,
    curp: null as string | null
  };

  // Estado inicial de las estadísticas 
  stats = {
    mascotas: 0,
    rescates: 0,
    tasa: 0,
    voluntarios: 0
  };

  @ViewChild('statsSection') statsSection!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animarContadores();
            observer.unobserve(entry.target); 
          }
        });
      }, { threshold: 0.5 }); 

      if (this.statsSection) {
        observer.observe(this.statsSection.nativeElement);
      }
    } else {
      this.animarContadores();
    }
  }

  showStep(step: 'intro' | 'roles' | 'register'): void {
    this.currentStep = step;
  }

  // Se llama al elegir voluntario (2) o Patrocinador (3) en el paso de roles
  selectRole(rolId: number): void {
    this.selectedRoleId = rolId;
    this.registerData.rol_id = rolId;
    this.errorMessage = '';
    this.successMessage = '';
    this.showStep('register');
  }

  doRegister(): void {
    if (!this.registerData.nombre_completo || !this.registerData.telefono || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Todos los campos obligatorios deben llenarse.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.registerData.rol_id = Number(this.registerData.rol_id);

    const payload = {
      ...this.registerData,
      curp: this.registerData.curp && this.registerData.curp.trim() !== '' ? this.registerData.curp : null
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = '¡Cuenta creada! Ya puedes iniciar sesión.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Error al registrar el usuario';
      }
    });
  }

  animarContadores(): void {
    this.animateValue('mascotas', 4820, 2000);
    this.animateValue('rescates', 2300, 2000);
    this.animateValue('tasa', 87, 2000);
    this.animateValue('voluntarios', 230, 2000);
  }

  // Función matemática fluida (EaseOut) para el llenado de números
  animateValue(key: keyof HomeComponent['stats'], finalValue: number, duration: number): void {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Efecto Ease-out para que frene suavemente al llegar al final
      const easeProgress = progress * (2 - progress);

      this.stats[key] = Math.floor(easeProgress * finalValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        this.stats[key] = finalValue; // Asegura el número exacto al final
      }
    };
    window.requestAnimationFrame(step);
  }
}