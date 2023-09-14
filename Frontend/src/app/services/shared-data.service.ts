import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private idPersona: number = 0;
  private informeId!: number;
  private solicitudId!: number;

  setIdPersona(id: number): void {
    this.idPersona = id;
  }

  getIdPersona(): number {
    return this.idPersona;
  }
  setInformeId(id: number) {
    this.informeId = id;
  }

  getInformeId() {
    return this.informeId;
  }

  setSolicitudId(id: number) {
    this.solicitudId = id;
  }
  getSolicitudId() {
    return this.solicitudId;
  }
}