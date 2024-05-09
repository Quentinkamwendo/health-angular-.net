import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  create(doctorId: string, patient: FormData) {
    return this.http.post(`api/Patient/${doctorId}`, patient);
  }

  getOne(doctorId: string, id: string) {
    return this.http.get<Patient>(`api/Patient/${doctorId}/${id}`);
  }

  getMany() {
    return this.http.get<Patient[]>('api/Patient');
  }

  update(doctorId: string, id: string, patient: FormData) {
    return this.http.put(`api/Patient/${doctorId}/${id}`, patient);
  }

  delete(id: string) {
    return this.http.delete(`api/Patient/${id}`);
  }
}
