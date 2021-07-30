import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Evento } from '../_models/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  baseURL= 'http://localhost:5000/site/values';

  constructor(private http: HttpClient) { }

  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }

  getEventoByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/getByTema/${tema}`);
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }

  postEvento(evento:Evento) {
    return this.http.post(`http://localhost:5000/api/evento`, evento);
  }

  putEvento(evento:Evento) {
    return this.http.put(`http://localhost:5000/api/evento/${evento.id}`, evento);
  }

  deleteEvento(id:number) {
    return this.http.delete(`http://localhost:5000/api/evento/${id}`);
  }
}
