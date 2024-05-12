import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  declarations: [
    PatientsComponent
    ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    InputTextModule,
    FloatLabelModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FileUploadModule,
    MatSnackBarModule,
    MatButtonModule,
    TabMenuModule
  ]
})
export class PatientsModule { }
