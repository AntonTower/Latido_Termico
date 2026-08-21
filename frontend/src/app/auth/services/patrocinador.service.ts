import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; 

export interface NegocioConfig {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface CatalogoItem {
  id?: number;
  nombre: string;
  tipo: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatrocinadorService {
  private apiUrl = `${environment.apiUrl}/patrocinador`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && localStorage) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDatosNegocio(): Observable<NegocioConfig> {
    return this.http.get<NegocioConfig>(`${this.apiUrl}/configuracion`, { headers: this.getAuthHeaders() });
  }

  guardarDatosNegocio(datos: NegocioConfig): Observable<any> {
    return this.http.put(`${this.apiUrl}/configuracion`, datos, { headers: this.getAuthHeaders() });
  }

  getCatalogo(): Observable<CatalogoItem[]> {
    return this.http.get<CatalogoItem[]>(`${this.apiUrl}/catalogo`, { headers: this.getAuthHeaders() });
  }

  guardarItemCatalogo(item: CatalogoItem): Observable<CatalogoItem> {
    return this.http.post<CatalogoItem>(`${this.apiUrl}/catalogo`, item, { headers: this.getAuthHeaders() });
  }

  actualizarItemCatalogo(id: number, item: CatalogoItem): Observable<CatalogoItem> {
    return this.http.put<CatalogoItem>(`${this.apiUrl}/catalogo/${id}`, item, { headers: this.getAuthHeaders() });
  }

  eliminarItemCatalogo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/catalogo/${id}`, { headers: this.getAuthHeaders() });
  }
}