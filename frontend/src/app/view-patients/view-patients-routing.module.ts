import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPatientsComponent } from './view-patients.component';

const routes: Routes = [
  {path: ':doctorId', component: ViewPatientsComponent},
  {path: ':doctorId/:id', component: ViewPatientsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewPatientsRoutingModule { }
