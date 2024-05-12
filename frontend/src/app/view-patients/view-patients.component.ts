import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrl: './view-patients.component.css',
})
export class ViewPatientsComponent implements OnInit {
  doctorId!: string;
  patients: any[] = [];
  id?: string;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.route.params.subscribe((params) => {
      this.doctorId = params['doctorId'];
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.id = this.route.snapshot.params['id'];
  }

  loadPatients() {
    this.patientService
      .getMany()
      .pipe(first())
      .subscribe((patients) => {
        this.patients = patients.$values;
      });
  }

  deletePatient(id: string) {
    this.patientService
      .delete(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackBar.open('Patient deleted', 'close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.loadPatients();
        },
        error: (err) => {
          this.snackBar.open(err, 'close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'left',
          });
        },
      });
  }
}
