import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta por defecto
  { path: '**', redirectTo: '' } // Si alguien escribe una ruta mala, lo manda al inicio
];