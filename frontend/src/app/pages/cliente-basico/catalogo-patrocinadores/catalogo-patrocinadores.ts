import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PatrocinadoresPublicoService,
  PatrocinadorPublico,
  CatalogoItemPublico
} from '../../../auth/services/patrocinadores-publico.service';

@Component({
  selector: 'app-catalogo-patrocinadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo-patrocinadores.html',
  styleUrls: ['./catalogo-patrocinadores.css']
})
export class CatalogoPatrocinadoresComponent implements OnInit {
  patrocinadores: PatrocinadorPublico[] = [];
  cargando = false;

  mostrarModal = false;
  patrocinadorSeleccionado: PatrocinadorPublico | null = null;
  catalogoSeleccionado: CatalogoItemPublico[] = [];
  cargandoCatalogo = false;

  constructor(private patrocinadoresPublicoService: PatrocinadoresPublicoService) {}

  ngOnInit(): void {
    this.cargarPatrocinadores();
  }

  cargarPatrocinadores(): void {
    this.cargando = true;
    this.patrocinadoresPublicoService.listarPatrocinadores().subscribe({
      next: (data) => {
        this.patrocinadores = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar patrocinadores:', err);
        this.cargando = false;
      }
    });
  }

  verCatalogo(patrocinador: PatrocinadorPublico): void {
    this.patrocinadorSeleccionado = patrocinador;
    this.mostrarModal = true;
    this.cargandoCatalogo = true;
    this.catalogoSeleccionado = [];

    this.patrocinadoresPublicoService.obtenerCatalogo(patrocinador.id).subscribe({
      next: (res) => {
        this.catalogoSeleccionado = res.catalogo;
        this.cargandoCatalogo = false;
      },
      error: (err) => {
        console.error('Error al cargar catálogo:', err);
        this.cargandoCatalogo = false;
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.patrocinadorSeleccionado = null;
    this.catalogoSeleccionado = [];
  }

  // Placeholder de imagen: iniciales del nombre del negocio, ya que aún no hay foto real
  getIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');
  }

  // Detecta qué tipo de enlace es, para mostrar el ícono correcto sin depender
  // de que el usuario haya llenado un campo aparte para elegirlo.
  getTipoEnlace(url?: string): 'whatsapp' | 'instagram' | 'web' | null {
    if (!url) return null;
    const lower = url.toLowerCase();
    if (lower.includes('wa.me') || lower.includes('whatsapp')) return 'whatsapp';
    if (lower.includes('instagram.com')) return 'instagram';
    return 'web';
  }

  getIconoEnlace(url?: string): string {
    switch (this.getTipoEnlace(url)) {
      case 'whatsapp': return 'chat';      // O 'forum'
      case 'instagram': return 'photo_camera'; // O 'photo_library'
      case 'web': return 'language';     // Icono de sitio web de Google
      default: return 'link';            // Icono genérico por defecto
    }
  }

  getEtiquetaEnlace(url?: string): string {
    switch (this.getTipoEnlace(url)) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'web': return 'Sitio web';
      default: return '';
    }
  }
}