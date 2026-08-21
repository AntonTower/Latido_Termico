import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PatrocinadorPublico {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export interface CatalogoItemPublico {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
}

export interface CatalogoPatrocinadorResponse {
  patrocinador: PatrocinadorPublico;
  catalogo: CatalogoItemPublico[];
}

@Injectable({
  providedIn: 'root'
})
export class PatrocinadoresPublicoService {
  private apiUrl = `${environment.apiUrl}/directorio-patrocinadores`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  listarPatrocinadores(): Observable<PatrocinadorPublico[]> {
    return this.http.get<PatrocinadorPublico[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obtenerCatalogo(patrocinadorId: number): Observable<CatalogoPatrocinadorResponse> {
    return this.http.get<CatalogoPatrocinadorResponse>(
      `${this.apiUrl}/${patrocinadorId}/catalogo`,
      { headers: this.getAuthHeaders() }
    );
  }
}