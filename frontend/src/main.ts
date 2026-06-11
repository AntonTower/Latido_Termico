import 'zone.js'; // <-- 🌟 LA SOLUCIÓN ESTÁ AQUÍ 
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Asegúrate de que apunte a './app/app' y no a 'app.component'

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));