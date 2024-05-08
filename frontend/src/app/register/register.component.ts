import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  ngOnInit(): void {}

  get form() {
    return this.registerForm.controls;
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.userService
        .register(this.registerForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
            this.snackBar.open('User registered successfully', 'close', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'left',
            });
          },
        });
    }
    return;
  }
}
