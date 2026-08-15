import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // Ajusta a la URL base de tu backend / API REST
  private apiUrl = 'http://localhost:3000/api/patrocinador'; 

  constructor(private http: HttpClient) {}

  // Obtiene los datos reales del negocio desde la DB
  getDatosNegocio(): Observable<NegocioConfig> {
    return this.http.get<NegocioConfig>(`${this.apiUrl}/configuracion`);
  }

  // Guarda o actualiza los datos ingresados
  guardarDatosNegocio(datos: NegocioConfig): Observable<any> {
    return this.http.put(`${this.apiUrl}/configuracion`, datos);
  }

  getCatalogo(): Observable<CatalogoItem[]> {
    return this.http.get<CatalogoItem[]>(`${this.apiUrl}/catalogo`);
  }

  // Insertar un nuevo ítem en la BD
  guardarItemCatalogo(item: CatalogoItem): Observable<CatalogoItem> {
    return this.http.post<CatalogoItem>(`${this.apiUrl}/catalogo`, item);
  }
}