import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el ngModel en modo edición
// 🌟 CORRECCIÓN: Eran 3 saltos hacia atrás, no 4
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css']
})
export class MisDatosComponent implements OnInit {
  // Estados de la vista
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;
  
  errorMessage: string = '';
  successMessage: string = '';

  // Datos reales traídos de PostgreSQL
  userData: any = null;

  // Datos temporales para el formulario de edición
  editData = { telefono: '', role: 2 };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getPerfil().subscribe({
      next: (res: any) => {
        this.userData = res; // Guardamos el perfil real
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar la información del perfil.';
        this.isLoading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Al entrar a editar, copiamos los datos actuales a las variables temporales
    if (this.isEditing && this.userData) {
      this.editData.telefono = this.userData.telefono || '';
      this.editData.role = this.userData.rol_id || 2;
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      telefono: this.editData.telefono,
      role: Number(this.editData.role)
    };

    this.authService.updatePerfil(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.successMessage = '¡Datos actualizados correctamente!';
        
        // Actualizamos la vista con los nuevos datos
        this.userData.telefono = payload.telefono;
        this.userData.rol_id = payload.role;
        this.userData.nombre_rol = payload.role === 1 ? 'Administrador' : 'Operador'; // Reflejo visual
        
        // Salimos del modo edición después de 1.5s
        setTimeout(() => this.isEditing = false, 1500);
      },
      error: (err: any) => {
        this.isSaving = false;
        this.errorMessage = err.error?.error || 'Ocurrió un error al actualizar los datos.';
      }
    });
  }
}