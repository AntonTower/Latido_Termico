import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  // 👇 Nombres cortos
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats = { reportes_realizados: 12, reportes_resueltos: 9 };

  reportesTomados = [
    { id: 104, especie: 'Perro', raza: 'Mestizo', zona: 'Roma Norte', estado: 'En_Proceso', foto: '🐶' }
  ];

  reportesRealizados = [
    { id: 201, especie: 'Gato', raza: 'Persa', zona: 'Condesa', estado: 'Resuelto', foto: '🐱' },
    { id: 205, especie: 'Perro', raza: 'Beagle', zona: 'Coyoacán', estado: 'Nuevo', foto: '🐕' }
  ];

  ngOnInit(): void {}
}