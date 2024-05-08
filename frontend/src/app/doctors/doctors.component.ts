import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Doctor } from '../models/doctor';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadEvent } from 'primeng/fileupload';
import { DoctorService } from '../services/doctor.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent implements OnInit {
  doctorForm!: FormGroup;
  id?: string;
  uploadedFiles: any[] = [];
  heading!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      DoctorName: [''],
      Age: [0],
      Specialization: [''],
      Hospital: [''],
      Image: [null],
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.heading = 'Create Doctor';

    if (this.id) {
      this.heading = 'Update Doctor';

      this.doctorService
        .getDoctor(this.id!)
        .pipe(first())
        .subscribe((x) => this.doctorForm.patchValue(x));
    }
  }

  get form() {
    return this.doctorForm.controls;
  }
  onSubmit() {
    if (this.doctorForm.valid) {
      const doctorData: Doctor = this.doctorForm.value;
      const formData = new FormData();
      formData.append('DoctorName', doctorData.DoctorName);
      formData.append('Age', doctorData.Age?.toString()!);
      formData.append('Specialization', doctorData.Specialization!);
      formData.append('Hospital', doctorData.Hospital!);
      formData.append('Image', doctorData.Image!);
      // for (let file of this.uploadedFiles) {
      //   formData.append('Image', file);
      // }

      if (this.id) {
        this.doctorService
          .update(this.id!, formData)
          .pipe(first())
          .subscribe({
            next: (response) => {
              this.doctorForm.reset();
              this.uploadedFiles = [];
              this.router.navigateByUrl('/');
              this.snackBar.open(
                `Doctor ${response.DoctorName} updated`,
                'close',
                {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'center',
                }
              );
            },
            error: (error) => {
              this.snackBar.open(error, 'close', {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
              });
            },
          });
      } else {
        this.doctorService
          .create(formData)
          .pipe()
          .subscribe({
            next: () => {
              this.router.navigateByUrl('/');
              this.snackBar.open('Doctor created successfully', 'close', {
                duration: 5000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            },
          });
      }
    }
  }

  onUpload(event: FileUploadEvent) {
    console.log(event.files[0]);
    console.log(event.files[0].name);
    const file = event.files[0];
    if (file) {
      this.uploadedFiles.push(file);
      this.doctorForm.get('Image')?.setValue(file);
      // this.doctorForm.patchValue({ Image: file });
      // this.doctorForm.get('Image')?.markAsTouched();
    }
  }

  // onUpload(event: FileUploadEvent) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //     this.doctorForm.get('Image')?.setValue(file);
  //   }
  // }

  // onFileSelected(event: Event, field: string) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     const file = fileInput.files![0];
  //     this.projectForm.get(field)?.setValue(file);
  //   }
  // }
}
