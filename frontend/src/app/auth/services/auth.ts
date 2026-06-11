import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(respuesta => {
        if (respuesta && respuesta.token) {
          localStorage.setItem('token', respuesta.token);
          if (respuesta.usuario && respuesta.usuario.rol_id) {
            localStorage.setItem('rol_id', respuesta.usuario.rol_id.toString());
          }
        }
      })
    );
  }

  // NUEVO MÉTODO DE REGISTRO
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol_id');
  }
}