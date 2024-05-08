import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './helpers/auth.guard';

const doctorsModule = () => import('./doctors/doctors.module').then(m => m.DoctorsModule);
const patientModule = () => import('./patients/patients.module').then(m => m.PatientsModule)

export const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'doctors', loadChildren: doctorsModule, canActivate: [AuthGuard]},
  {path: 'patients', loadChildren: patientModule, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];
