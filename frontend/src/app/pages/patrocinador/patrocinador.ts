import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private patrocinadorService: PatrocinadorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentView = (this.route.snapshot.data['view'] as 'dashboard' | 'configuracion' | 'catalogo') ?? 'dashboard';

    this.calcularTotales();
    this.cargarDatosNegocio();
    this.cargarCatalogo();
  }

  // Trae el catálogo real desde la base de datos (Neon)
  cargarCatalogo(): void {
    this.cargando = true;
    this.patrocinadorService.getCatalogo().subscribe({
      next: (data) => {
        this.catalogo = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener catálogo:', err);
        this.cargando = false;
      }
    });
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

  // Abre el modal en blanco, listo para crear un item nuevo
  abrirModalCrear(): void {
    this.editando = false;
    this.nuevoItem = { nombre: '', tipo: '', precio: 0 };
    this.mostrarModal = true;
  }

  // Abre el modal precargado con los datos del item que se va a editar
  editarItem(item: CatalogoItem): void {
    this.editando = true;
    // copia aparte, para no mutar la fila de la tabla mientras se edita en el modal
    this.nuevoItem = { ...item };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // Un solo método para el submit del modal: decide si crea o actualiza
  guardarItemCatalogo(): void {
    if (!this.nuevoItem.nombre || !this.nuevoItem.tipo) return;

    this.cargando = true;

    if (this.editando && this.nuevoItem.id) {
      this.patrocinadorService.actualizarItemCatalogo(this.nuevoItem.id, this.nuevoItem).subscribe({
        next: (itemActualizado) => {
          const index = this.catalogo.findIndex(i => i.id === itemActualizado.id);
          if (index !== -1) {
            this.catalogo[index] = itemActualizado;
          }
          this.cargando = false;
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar item:', err);
          this.cargando = false;
          alert('Ocurrió un error al actualizar el item.');
        }
      });
    } else {
      this.patrocinadorService.guardarItemCatalogo(this.nuevoItem).subscribe({
        next: (itemCreado) => {
          this.catalogo.push(itemCreado);
          this.cargando = false;
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al guardar item:', err);
          this.cargando = false;
          alert('Ocurrió un error al guardar el item.');
        }
      });
    }
  }

  // Pide confirmación y elimina el item, tanto de la BD como de la tabla en pantalla
  eliminarItem(item: CatalogoItem): void {
    if (!item.id) return;

    const confirmado = confirm(`¿Seguro que quieres eliminar "${item.nombre}" del catálogo? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.cargando = true;
    this.patrocinadorService.eliminarItemCatalogo(item.id).subscribe({
      next: () => {
        this.catalogo = this.catalogo.filter(i => i.id !== item.id);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al eliminar item:', err);
        this.cargando = false;
        alert('Ocurrió un error al eliminar el item.');
      }
    });
  }
}