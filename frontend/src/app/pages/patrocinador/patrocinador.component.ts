import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { PatrocinadorService, CatalogoItem, NegocioConfig } from '../../auth/services/patrocinador.service';

@Component({
  selector: 'app-patrocinador',
  standalone: true, // 👈 Marca el componente como standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './patrocinador.component.html',
  styleUrls: ['./patrocinador.css']
})
export class PatrocinadorComponent implements OnInit {

  mostrarModalCrear: boolean = false;
  catalogoItems: CatalogoItem[] = [];

  nuevoItem: CatalogoItem = {
    nombre: '',
    tipo: '',
    precio: 0
  };

  negocioConfig: NegocioConfig = {
    nombre: '',
    direccion: '',
    telefono: ''
  };

  constructor(private patrocinadorService: PatrocinadorService) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.patrocinadorService.getCatalogo().subscribe({
      /* Tipado explícito agregado a 'data' y 'err' */
      next: (data: CatalogoItem[]) => {
        this.catalogoItems = data;
      },
      error: (err: any) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
  }

  cerrarModal(): void {
    this.mostrarModalCrear = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoItem = {
      nombre: '',
      tipo: '',
      precio: 0
    };
  }

  guardarItemCatalogo(): void {
    if (!this.nuevoItem.nombre || !this.nuevoItem.tipo || this.nuevoItem.precio <= 0) {
      alert('Por favor, llena todos los campos correctamente.');
      return;
    }

    this.patrocinadorService.guardarItemCatalogo(this.nuevoItem).subscribe({
      /* Tipado explícito agregado a 'itemGuardado' y 'err' */
      next: (itemGuardado: CatalogoItem) => {
        this.catalogoItems.push(itemGuardado);
        this.cerrarModal();
        console.log('Producto guardado exitosamente en BD:', itemGuardado);
      },
      error: (err: any) => {
        console.error('Error al guardar en la base de datos:', err);
        alert('Ocurrió un error al intentar guardar en la base de datos.');
      }
    });
  }
}