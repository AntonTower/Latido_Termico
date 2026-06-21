import { Routes } from '@angular/router';

export const routes: Routes = [
  // 🌍 1. ENTORNO PÚBLICO (Visitantes)
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/public/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'registro',
        loadComponent: () => import('./pages/public/register/register').then(m => m.RegisterComponent)
      }
    ]
  },

  // 🛡️ 2. ENTORNO PRIVADO EXCLUSIVO (Miembros Registrados)
  {
    path: 'operaciones',
    // 👇 Nombres cortos aquí
    loadComponent: () => import('./layouts/member-layout/member-layout').then(m => m.MemberLayoutComponent),
    children: [
      {
        path: '', // Ruta por defecto al entrar a /operaciones
        // 👇 Nombres cortos aquí
        loadComponent: () => import('./pages/cliente-basico/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'mis-datos',
        loadComponent: () => import('./pages/cliente-basico/mis-datos/mis-datos').then(m => m.MisDatosComponent)
      }
    ]
  },

  // Comodín global de seguridad
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];