import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-datos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-datos.html',
  styleUrls: ['./mis-datos.css']
})
export class MisDatosComponent implements OnInit {
  // Datos simulados basados en el esquema de la BD (PostgreSQL)
  userData = {
    nombre_completo: 'Juan Pérez García',
    email: 'juan.perez@ejemplo.com',
    telefono: '5551234567',
    curp: 'PEGA900101HDFRXX00',
    rol: 'Cliente Básico',
    fecha_registro: '10 de Junio, 2026'
  };

  ngOnInit(): void {
    // En el futuro, aquí inyectaremos el AuthService para decodificar 
    // el JWT de localStorage y traer los datos reales del backend.
  }
}