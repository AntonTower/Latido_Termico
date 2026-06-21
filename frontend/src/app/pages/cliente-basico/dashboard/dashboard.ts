import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  direccion?: string; // si el backend hace reverse-geocoding
  lat: number;
  lng: number;
  hora_avistamiento: string;
  fotoUrl?: string;
}

// 🌟 Pipe puro: arma la URL del mapa embebido (OSM, sin API key) y la sanitiza
@Pipe({ name: 'mapEmbed', standalone: true, pure: true })
export class MapEmbedPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(lat: number, lng: number): SafeResourceUrl | null {
    if (lat == null || lng == null) return null;
    const delta = 0.006; // ~600m de radio visible
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
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
  stats = { reportes_realizados: 12, reportes_resueltos: 9 };

  reportesTomados: ReporteMascota[] = [
    {
      id: 104, especie: 'Perro', raza_aprox: 'Mestizo', color_dominante: 'Café y blanco',
      sexo: 'Macho', edad_aprox: 'Adulto', tamano: 'Mediano', estado: 'En_Proceso',
      agresividad: 2, caracteristicas_especiales: 'Cojea de la pata trasera derecha, collar rojo sin placa.',
      referencias: 'Frente al parque, cerca de la fuente',
      direccion: 'Av. Álvaro Obregón 145, Roma Norte, CDMX',
      lat: 19.4189, lng: -99.1660,
      hora_avistamiento: '2026-06-20T18:24:00',
      fotoUrl: 'https://res.cloudinary.com/dhwtj9kku/image/upload/v1780773883/rescuenet_reportes/je00qm0tj7iuqccr8mit.jpg'
    }
  ];

  reportesRealizados: ReporteMascota[] = [
    {
      id: 201, especie: 'Gato', raza_aprox: 'Persa', color_dominante: 'Negro',
      sexo: 'Desconocido', edad_aprox: 'Desconocido', tamano: 'Desconocido', estado: 'Resuelto',
      agresividad: 1, caracteristicas_especiales: 'Pelaje largo, muy dócil, se dejó cargar sin problema.',
      direccion: 'Av. Yucatán 32, Condesa, CDMX',
      lat: 19.4123, lng: -99.1716,
      hora_avistamiento: '2026-06-06T19:24:45',
      fotoUrl: 'https://res.cloudinary.com/dhwtj9kku/image/upload/v1780774200/rescuenet_reportes/itrv8zlsfgpwrb1rnjt2.jpg'
    },
    {
      id: 205, especie: 'Perro', raza_aprox: 'Beagle', color_dominante: 'Tricolor',
      sexo: 'Hembra', edad_aprox: 'Cachorro', tamano: 'Pequeño', estado: 'Nuevo',
      agresividad: 4, caracteristicas_especiales: 'Ladra a desconocidos, no se deja acercar fácilmente.',
      referencias: 'Salida del mercado sobre Av. Universidad',
      lat: 19.3467, lng: -99.1618,
      hora_avistamiento: '2026-06-19T09:10:00',
      fotoUrl: undefined
    }
  ];

  ngOnInit(): void {}

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