import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Revisa que la ruta './layouts/public-layout/public-layout' exista exactamente así
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/public/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'cliente-basico/mis-datos',
        loadComponent: () => import('./pages/cliente-basico/mis-datos/mis-datos').then(m => m.MisDatosComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];