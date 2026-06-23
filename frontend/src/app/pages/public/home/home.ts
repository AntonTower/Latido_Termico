import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {
  // Estado inicial de las estadísticas (en 0 para la animación)
  stats = {
    mascotas: 0,
    familias: 0,
    tasa: 0,
    voluntarios: 0
  };

  @ViewChild('statsSection') statsSection!: ElementRef;

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animarContadores();
            observer.unobserve(entry.target); // Solo se anima la primera vez que se ve
          }
        });
      }, { threshold: 0.5 }); // Se activa cuando el 50% de la sección es visible

      if (this.statsSection) {
        observer.observe(this.statsSection.nativeElement);
      }
    } else {
      // Fallback si el navegador no soporta IntersectionObserver
      this.animarContadores();
    }
  }

  animarContadores(): void {
    this.animateValue('mascotas', 4820, 2000);
    this.animateValue('familias', 12300, 2000);
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