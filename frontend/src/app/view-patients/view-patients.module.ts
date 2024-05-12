import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewPatientsRoutingModule } from './view-patients-routing.module';
import { ViewPatientsComponent } from './view-patients.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    ViewPatientsComponent
  ],
  imports: [
    CommonModule,
    ViewPatientsRoutingModule,
    MatSnackBarModule,
    MatCardModule,
    RouterModule,
    MatListModule,
    ButtonModule
  ]
})
export class ViewPatientsModule { }
