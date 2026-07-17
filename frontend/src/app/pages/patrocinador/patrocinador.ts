import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AlimentoRecurso {
  tipo: string;
  cantidadKg: number;
  marcaSugerida?: string;
}

interface MaterialRecurso {
  nombre: string;
  categoria: 'Transporte' | 'Control' | 'Abrigo' | 'Protección';
  detalles: string;
  cantidad: number;
}

interface CatalogoItem {
  nombre: string;
  tipo: 'Servicio' | 'Medicamento';
  precio: number;
}

interface NegocioInfo {
  nombre: string;
  direccion: string;
  telefono: string;
}

@Component({
  selector: 'app-patrocinador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patrocinador.html',
  styleUrls: ['./patrocinador.css']
})
export class PatrocinadorComponent implements OnInit {

  currentView: 'dashboard' | 'configuracion' | 'catalogo' = 'dashboard';

  changeView(view: 'dashboard' | 'configuracion' | 'catalogo'): void {
    this.currentView = view;
  }

  negocio: NegocioInfo = {
    nombre: 'Veterinaria San Francisco',
    direccion: 'Av. Juárez #405, Centro',
    telefono: '222 123 4567'
  };

  alimentos: AlimentoRecurso[] = [
    { tipo: 'Alimento para Perro (Cachorro)', cantidadKg: 120, marcaSugerida: 'ProPlan / Pedigree' },
    { tipo: 'Alimento para Perro (Adulto)', cantidadKg: 250, marcaSugerida: 'Dog Chow' },
    { tipo: 'Alimento para Gato (Cachorro)', cantidadKg: 80, marcaSugerida: 'Whiskas Minino' },
    { tipo: 'Alimento para Gato (Adulto)', cantidadKg: 150, marcaSugerida: 'Cat Chow' }
  ];

  materiales: MaterialRecurso[] = [
    { nombre: 'Transportadoras', categoria: 'Transporte', detalles: 'Chica (x5), Mediana (x8), Grande (x4)', cantidad: 17 },
    { nombre: 'Correas', categoria: 'Control', detalles: 'Nylon reforzado (3 metros)', cantidad: 25 },
    { nombre: 'Bozales', categoria: 'Control', detalles: 'Ajustables (Tallas S, M, L)', cantidad: 12 },
    { nombre: 'Mantas / Cobijas', categoria: 'Abrigo', detalles: 'Térmicas e impermeables', cantidad: 40 },
    { nombre: 'Guantes de alta protección', categoria: 'Protección', detalles: 'Kevlar / Carnaza para manejo rudo', cantidad: 10 },
    { nombre: 'Protecciones corporales', categoria: 'Protección', detalles: 'Pecheras de seguridad y mangas', cantidad: 6 }
  ];

  catalogo: CatalogoItem[] = [
    { nombre: 'Consulta Veterinaria General', tipo: 'Servicio', precio: 250 },
    { nombre: 'Desparasitación Interna', tipo: 'Medicamento', precio: 120 }
  ];

  totalAlimento = 0;
  totalMateriales = 0;

  ngOnInit(): void {
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.totalAlimento = this.alimentos.reduce((sum, item) => sum + item.cantidadKg, 0);
    this.totalMateriales = this.materiales.reduce((sum, item) => sum + item.cantidad, 0);
  }

  guardarConfiguracion(): void {
    // TODO: conectar con ReporteService/PatrocinadorService cuando esté el endpoint
    console.log('Guardando configuración:', this.negocio);
  }
}