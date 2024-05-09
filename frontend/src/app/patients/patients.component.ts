import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  patientForm!: FormGroup;
  id?: string;
  doctorId!: string;
  uploadedFiles: any[] = [];
  title!: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      PatientName: ['', Validators.required],
      Residence: ['', Validators.required],
      TreatmentDate: ['', Validators.required],
      Disease: ['', Validators.required],
      Age: [0, Validators.required],
      Image: [null, Validators.required],
    });

    // Extract projectId from the route parameters
    this.route.params.subscribe((params) => {
      this.doctorId = params['doctorId'];
    });
    // this.route.params.subscribe((params) => {
    //   this.projectId = params['projectId'];
    // });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.title = 'Create Patient';

    if (this.id) {
      this.title = 'Update Patient';
      this.patientService
        .getOne(this.doctorId, this.id)
        .pipe(first())
        .subscribe((x) => this.patientForm.patchValue(x));
    }
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const patientData: Patient = this.patientForm.value;
      const patient = new FormData();
      patient.append('PatientName', patientData.PatientName!);
      patient.append('Residence', patientData.Residence!);
      patient.append('TreatmentDate', patientData.TreatmentDate?.toString()!);
      patient.append('Disease', patientData.Disease!);
      patient.append('Age', patientData.Age?.toString()!);
      patient.append('Image', patientData.Image!);
      if (this.id) {
        this.patientService
          .update(this.doctorId, this.id, patient)
          .pipe(first())
          .subscribe({
            next: () => {
              this.patientForm.reset();
              this.snackBar.open('Patient update', 'close', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'left',
              });
              this.router.navigateByUrl('/');
            },
            error: (err) => {
              this.snackBar.open(err, 'close', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
              });
            },
          });
      } else {
        this.patientService
          .create(this.doctorId, patient)
          .pipe(first())
          .subscribe({
            next: () => {
              this.patientForm.reset();
              this.snackBar.open('Patient created', 'close', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'left',
              });
              this.router.navigateByUrl('/');
            },
          });
      }
    }
  }

  items: MenuItem[] | undefined;
  // ngOnInit(): void {
  //   this.items = [
  //     {
  //       label: 'Update',
  //       icon: 'pi pi-refresh'
  //     },
  //     {
  //       label: 'Delete',
  //       icon: 'pi pi-times'
  //     }
  //   ]
  // }

  onUpload(event: FileUploadEvent) {
    console.log(event.files[0]);
    const file = event.files[0];
    if (file) {
      this.uploadedFiles.push(file);
      this.patientForm.get('Image')?.setValue(file);
    }
  }
}
