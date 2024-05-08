import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  create(doctor: FormData) {
    return this.http.post('api/Doctor', doctor);
  }

  getDoctors() {
    return this.http.get<Doctor[]>('api/Doctor');
  }

  getDoctor(id: string) {
    return this.http.get<Doctor>(`api/Doctor/${id}`);
  }

  update(id: string, doctor: FormData) {
    return this.http.put<Doctor>(`api/Doctor/${id}`, doctor);
  }

  delete(id: string) {
    return this.http.delete(`api/Doctor/${id}`);
  }
}
