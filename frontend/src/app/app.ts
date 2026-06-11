import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // Usamos template directo con backticks, sin URL
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'latido-admin';
}