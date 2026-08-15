import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatrocinadorService } from '../../auth/services/patrocinador.service';

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
  id?: number;
  nombre: string;
  tipo: 'Servicio' | 'Medicamento' | 'Alimento' | 'Material' | string;
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
  cargando: boolean = false;

  changeView(view: 'dashboard' | 'configuracion' | 'catalogo'): void {
    this.currentView = view;
  }

  // Se inicializa vacío para reemplazar los datos fijos/genéricos
  negocio: NegocioInfo = {
    nombre: '',
    direccion: '',
    telefono: ''
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

// ✅ AHORA:
  catalogo: CatalogoItem[] = [];

  mostrarModal: boolean = false;
  editando: boolean = false;
  nuevoItem: CatalogoItem = {
    nombre: '',
    tipo: '',
    precio: 0
  };

  totalAlimento = 0;
  totalMateriales = 0;

  constructor(private patrocinadorService: PatrocinadorService) {}

  ngOnInit(): void {
    this.calcularTotales();
    this.cargarDatosNegocio();
  }

  calcularTotales(): void {
    this.totalAlimento = this.alimentos.reduce((sum, item) => sum + item.cantidadKg, 0);
    this.totalMateriales = this.materiales.reduce((sum, item) => sum + item.cantidad, 0);
  }

  // Carga los datos reales desde la base de datos
  cargarDatosNegocio(): void {
    this.cargando = true;
    this.patrocinadorService.getDatosNegocio().subscribe({
      next: (data) => {
        if (data) {
          this.negocio = data;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del negocio:', err);
        this.cargando = false;
      }
    });
  }

  // Envía los cambios al backend
  guardarConfiguracion(): void {
    this.cargando = true;
    this.patrocinadorService.guardarDatosNegocio(this.negocio).subscribe({
      next: (res) => {
        this.cargando = false;
        alert('¡Configuración guardada correctamente!');
      },
      error: (err) => {
        console.error('Error al guardar configuración:', err);
        this.cargando = false;
        alert('Ocurrió un error al intentar guardar los datos.');
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.nuevoItem = { nombre: '', tipo: '', precio: 0 };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarItemCatalogo(): void {
    if (!this.nuevoItem.nombre || !this.nuevoItem.tipo) return;

    this.cargando = true;

    // Simulación local para probar la interfaz
    setTimeout(() => {
      this.catalogo.push({ ...this.nuevoItem, id: Date.now() });
      this.cargando = false;
      this.cerrarModal();
    }, 500);
  }
}