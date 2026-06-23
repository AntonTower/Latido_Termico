import { Routes } from '@angular/router';
// 👇 1. Agregamos "Component" al final de los nombres
import { MisReportesComponent } from './pages/cliente-basico/mis-reportes/mis-reportes';
import { MisCasosComponent } from './pages/cliente-basico/mis-casos/mis-casos';

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
      { path: '', loadComponent: () => import('./pages/cliente-basico/dashboard/dashboard').then(m => m.DashboardComponent)},
      { path: 'mis-datos', loadComponent: () => import('./pages/cliente-basico/mis-datos/mis-datos').then(m => m.MisDatosComponent)},
      
      // 👇 2. Actualizamos aquí también
      { path: 'mis-reportes', component: MisReportesComponent }, // 🌟 CORREGIDO
      { path: 'mis-casos', component: MisCasosComponent }        // 🌟 CORREGIDO
    ]
  },

  // Comodín global de seguridad
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];