import { Routes } from '@angular/router';
import { MisReportesComponent } from './pages/cliente-basico/mis-reportes/mis-reportes';
import { MisCasosComponent } from './pages/cliente-basico/mis-casos/mis-casos';

export const routes: Routes = [
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

  {
    path: 'operaciones',
    loadComponent: () => import('./layouts/member-layout/member-layout').then(m => m.MemberLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/cliente-basico/dashboard/dashboard').then(m => m.DashboardComponent)},
      { path: 'mis-datos', loadComponent: () => import('./pages/cliente-basico/mis-datos/mis-datos').then(m => m.MisDatosComponent)},
      { path: 'mis-reportes', component: MisReportesComponent },
      { path: 'mis-casos', component: MisCasosComponent },
      { path: 'catalogo-patrocinadores', loadComponent: () => import('./pages/cliente-basico/catalogo-patrocinadores/catalogo-patrocinadores').then(m => m.CatalogoPatrocinadoresComponent) },
      { path: 'patrocinador/dashboard', loadComponent: () => import('./pages/patrocinador/patrocinador').then(m => m.PatrocinadorComponent), data: { view: 'dashboard' } },
      { path: 'patrocinador/catalogo', loadComponent: () => import('./pages/patrocinador/patrocinador').then(m => m.PatrocinadorComponent), data: { view: 'catalogo' } },
      { path: 'patrocinador/configuracion', loadComponent: () => import('./pages/patrocinador/patrocinador').then(m => m.PatrocinadorComponent), data: { view: 'configuracion' } }
    ]
  },

  // Comodín global de seguridad
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];