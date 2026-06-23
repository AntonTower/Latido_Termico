import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Ajusta la ruta a tu environment

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // 🌟 Trae los reportes creados por el usuario actual
  getMisReportes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-reportes`, { headers: this.getAuthHeaders() });
  }

  // 🌟 (Futuro) Traerá los reportes que el usuario aceptó rescatar
  getMisRescatesTomados(): Observable<any[]> {
    // Por ahora usamos la misma o activos, pero aquí irá tu futura ruta del backend
    return this.http.get<any[]>(`${this.apiUrl}/mis-reportes`, { headers: this.getAuthHeaders() }); 
  }
}