import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../auth/services/reporte.service';
import { MapEmbedPipe, ReporteMascota } from '../dashboard/dashboard';

@Component({
  selector: 'app-mis-casos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-casos.html',
  styleUrls: ['./mis-casos.css'] 
})
export class MisCasosComponent implements OnInit {
  casos: ReporteMascota[] = [];
  isLoading: boolean = true;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.reporteService.getMisRescatesTomados().subscribe({
      next: (data) => {
        this.casos = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando casos:', err);
        this.isLoading = false;
      }
    });
  }

  getEspecieIcon(especie: string): string {
    const map: Record<string, string> = { Perro: '🐶', Gato: '🐱' };
    return map[especie] ?? '🐾';
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = { Nuevo: 'new', En_Proceso: 'process', Resuelto: 'success' };
    return map[estado] ?? 'new';
  }
}