import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../models/doctor';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { first } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  doctors: any[] = [];

  constructor(
    private doctorService: DoctorService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  // deleteProject(id: string) {
  //   this.addProjectService.deleteProject(id)
  //   .pipe(first())
  //     .subscribe(() => this.projects = this.projects!.filter((x: { id: string; }) => x.id !== id));
  // }
  onDelete(id: string) {
    this.doctorService
      .delete(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.doctors = this.doctors!.filter(
            (x: { id: string }) => x.id !== id
          );
          this.snackBar.open('Doctor deleted', 'close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.loadDoctors();
        },
        error: (err) => {
          this.snackBar.open(err, 'close', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        },
      });
  }

  onLogout() {
    this.userService
      .logout()
      .pipe()
      .subscribe({
        next: () => {
          this.snackBar.open('successfully logged out', 'close', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
          });
          this.router.navigateByUrl('/login');
        },
      });
  }

  loadDoctors() {
    this.doctorService
      .getDoctors()
      .pipe(first())
      .subscribe((doctors) => {
        this.doctors = doctors;
      });
  }
}
