import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../auth/services/reporte.service';
import { MapEmbedPipe, ReporteMascota } from '../dashboard/dashboard'; // Reutilizamos tu interface y pipe

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reportes.html',
  styleUrls: ['./mis-reportes.css']
})
export class MisReportesComponent implements OnInit {
  reportes: ReporteMascota[] = [];
  isLoading: boolean = true;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.reporteService.getMisReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando reportes:', err);
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