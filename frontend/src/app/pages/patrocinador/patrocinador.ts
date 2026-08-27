import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PatrocinadorService } from '../../auth/services/patrocinador.service';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

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
  logo_url?: string | null;
  enlace_contacto?: string | null;
  tipo_patrocinio?: string | null;
  bio?: string | null;
}

@Component({
  selector: 'app-patrocinador-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './patrocinador.html',
  styleUrls: ['./patrocinador.css']
})
export class PatrocinadorComponent implements OnInit {

  currentView: 'dashboard' | 'configuracion' | 'catalogo' = 'dashboard';
  cargando: boolean = false;

  cargandoCatalogo: boolean = true;
  cargandoNegocio: boolean = true;

  changeView(view: 'dashboard' | 'configuracion' | 'catalogo'): void {
    this.currentView = view;
  }

  negocio: NegocioInfo = {
    nombre: '',
    direccion: '',
    telefono: '',
    logo_url: null,
    enlace_contacto: null,
    tipo_patrocinio: null,
    bio: null
  };

  tiposPatrocinio: string[] = ['Empresa', 'Independiente / Emprendimiento', 'Protectora'];

  bioMaxLength: number = 300;

  archivoLogoSeleccionado: File | null = null;
  logoPreviewUrl: string | null = null;
  subiendoLogo: boolean = false;
  errorLogo: string = '';
  mostrarModalRecorte: boolean = false;
  imagenParaRecortar: Event | null = null; 
  imagenRecortadaBase64: string | null = null;
  imagenRecortadaBlob: Blob | null = null;

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

  get totalItemsCatalogo(): number {
    return this.catalogo.length;
  }

  get desgloseCatalogoPorTipo(): { tipo: string; cantidad: number }[] {
    const conteo: { [tipo: string]: number } = {};
    for (const item of this.catalogo) {
      conteo[item.tipo] = (conteo[item.tipo] || 0) + 1;
    }
    return Object.keys(conteo).map(tipo => ({ tipo, cantidad: conteo[tipo] }));
  }
 /* EDICION DEL COLOR DE LA GRAFICA*/ 
  private coloresCatalogo: { [tipo: string]: string } = {
    'Servicio': '#1c7a4d',
    'Alimento': '#9a6c0c',
    'Material': '#0369a1',
    'Medicamento': '#b45309'
  };

  colorParaTipo(tipo: string): string {
    return this.coloresCatalogo[tipo] || '#a59b95';
  }

  get catalogoChartGradient(): string {
    const total = this.totalItemsCatalogo;
    if (!total) return 'conic-gradient(#e2d8d0 0deg 360deg)';

    let acumulado = 0;
    const partes = this.desgloseCatalogoPorTipo.map(grupo => {
      const inicio = (acumulado / total) * 360;
      acumulado += grupo.cantidad;
      const fin = (acumulado / total) * 360;
      return `${this.colorParaTipo(grupo.tipo)} ${inicio}deg ${fin}deg`;
    });
    return `conic-gradient(${partes.join(', ')})`;
  }

  get itemsChecklistPerfil(): { label: string; completo: boolean }[] {
    return [
      { label: 'Logo del negocio', completo: !!this.negocio.logo_url },
      { label: 'Descripción breve (bio)', completo: !!this.negocio.bio },
      { label: 'Clasificación del patrocinador', completo: !!this.negocio.tipo_patrocinio },
      { label: 'Canal de contacto', completo: !!this.negocio.enlace_contacto },
      { label: 'Dirección', completo: !!this.negocio.direccion },
      { label: 'Teléfono', completo: !!this.negocio.telefono },
      { label: 'Al menos un producto en el catálogo', completo: this.catalogo.length > 0 }
    ];
  }

  get porcentajePerfilCompleto(): number {
    const items = this.itemsChecklistPerfil;
    const completos = items.filter(i => i.completo).length;
    return Math.round((completos / items.length) * 100);
  }

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

  getIconoEnlace(url?: string): string {
    switch (this.getTipoEnlace(url)) {
      case 'WhatsApp': return 'chat';
      case 'Instagram': return 'photo_camera';
      case 'Sitio Web': return 'language';
      default: return 'link';
    }
  }

  getTipoEnlace(url?: string): string {
    if (!url) return '';
    if (url.includes('wa.me') || url.includes('whatsapp')) return 'WhatsApp';
    if (url.includes('instagram.com')) return 'Instagram';
    return 'Sitio Web';
  }
  cargarCatalogo(): void {
    this.cargandoCatalogo = true;
    this.patrocinadorService.getCatalogo().subscribe({
      next: (data) => {
        this.catalogo = data;
        this.cargandoCatalogo = false;
      },
      error: (err) => {
        console.error('Error al obtener catálogo:', err);
        this.cargandoCatalogo = false;
      }
    });
  }

  calcularTotales(): void {
    this.totalAlimento = this.alimentos.reduce((sum, item) => sum + item.cantidadKg, 0);
    this.totalMateriales = this.materiales.reduce((sum, item) => sum + item.cantidad, 0);
  }

  cargarDatosNegocio(): void {
    this.cargandoNegocio = true;
    this.patrocinadorService.getDatosNegocio().subscribe({
      next: (data) => {
        if (data) {
          this.negocio = data;
        }
        this.cargandoNegocio = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del negocio:', err);
        this.cargandoNegocio = false;
      }
    });
  }

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

  // --- Lógica del logo ---

  onLogoSeleccionado(event: Event): void {
    this.errorLogo = '';
    const input = event.target as HTMLInputElement;
    const archivo = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!archivo) return;

    // Validaciones básicas antes de subir: tipo y tamaño (2MB máx)
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      this.errorLogo = 'Formato no soportado. Usa PNG, JPG o WEBP.';
      input.value = '';
      return;
    }
    if (archivo.size > 2 * 1024 * 1024) {
      this.errorLogo = 'La imagen no puede pesar más de 2MB.';
      input.value = '';
      return;
    }

    this.imagenParaRecortar = event;
    this.mostrarModalRecorte = true;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.imagenRecortadaBase64 = event.base64 ?? null;
    if (event.blob) {
      this.imagenRecortadaBlob = event.blob;
    }
  }

  confirmarRecorte(): void {
    if (!this.imagenRecortadaBlob) return;

    const archivoRecortado = new File([this.imagenRecortadaBlob], 'logo.png', { type: 'image/png' });
    this.archivoLogoSeleccionado = archivoRecortado;
    this.logoPreviewUrl = this.imagenRecortadaBase64;

    this.mostrarModalRecorte = false;
    this.imagenParaRecortar = null;
  }

  cancelarRecorte(): void {
    this.mostrarModalRecorte = false;
    this.imagenParaRecortar = null;
    this.imagenRecortadaBase64 = null;
    this.imagenRecortadaBlob = null;
    this.archivoLogoSeleccionado = null;
  }

  subirLogo(): void {
    if (!this.archivoLogoSeleccionado) return;

    this.subiendoLogo = true;
    this.errorLogo = '';

    this.patrocinadorService.subirLogo(this.archivoLogoSeleccionado).subscribe({
      next: (res) => {
        this.negocio.logo_url = res.logo_url;
        this.logoPreviewUrl = null;
        this.archivoLogoSeleccionado = null;
        this.subiendoLogo = false;
        alert('¡Logo actualizado correctamente!');
      },
      error: (err) => {
        console.error('Error al subir el logo:', err);
        this.errorLogo = err.error?.error || 'Ocurrió un error al subir el logo.';
        this.subiendoLogo = false;
      }
    });
  }

  cancelarSeleccionLogo(): void {
    this.archivoLogoSeleccionado = null;
    this.logoPreviewUrl = null;
    this.errorLogo = '';
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.nuevoItem = { nombre: '', tipo: '', precio: 0 };
    this.mostrarModal = true;
  }

  editarItem(item: CatalogoItem): void {
    this.editando = true;
    this.nuevoItem = { ...item };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

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