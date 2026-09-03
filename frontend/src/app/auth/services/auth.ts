import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

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

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol_id');
    }
  }

  getPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil`, { headers: this.getAuthHeaders() });
  }

  updatePerfil(data: { telefono?: string, role?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/perfil`, data, { headers: this.getAuthHeaders() });
  }
}