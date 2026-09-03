import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReporteService } from '../../../auth/services/reporte.service';

export interface ReporteMascota {
  id: number;
  especie: string;
  raza_aprox?: string;
  color_dominante: string;
  sexo: string;
  edad_aprox: string;
  tamano: string;
  estado: string;
  agresividad: number; // 1-5
  caracteristicas_especiales?: string;
  notas_adicionales?: string;
  referencias?: string;
  direccion?: string; 
  latitud: number; 
  longitud: number; 
  hora_avistamiento?: string; 
  foto_url?: string; 
}

@Pipe({ name: 'mapEmbed', standalone: true, pure: true })
export class MapEmbedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(latitud: number, longitud: number): SafeResourceUrl | null {
    if (latitud == null || longitud == null) return null;
    const delta = 0.006; // ~600m de radio visible
    const bbox = `${longitud - delta},${latitud - delta},${longitud + delta},${latitud + delta}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitud},${longitud}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapEmbedPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats = { reportes_realizados: 0, reportes_resueltos: 0 };

  reportesTomados: ReporteMascota[] = []; 
  reportesRealizados: ReporteMascota[] = [];

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarMisAlertasEmitidas();
  }

  cargarMisAlertasEmitidas(): void {
    this.reporteService.getMisReportes().subscribe({
      next: (data: ReporteMascota[]) => {
        this.reportesRealizados = data;
        
        this.stats.reportes_realizados = data.length;
        this.stats.reportes_resueltos = data.filter(r => r.estado === 'Resuelto' || r.estado === 'Completado').length;
      },
      error: (err: any) => { 
        console.error('Error al cargar mis reportes:', err);
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

  getAgresividadColor(nivel: number): string {
    if (nivel >= 4) return 'high';
    if (nivel >= 2) return 'mid';
    return 'low';
  }
}