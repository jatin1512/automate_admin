import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarCompanyListComponent } from './car-company-list/car-comapany-list.component';
import { AddEditCarCompanyComponent } from './add-edit-car-company/add-edit-car-company.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


const routes: Routes = [
  { path: '', component: CarCompanyListComponent, canActivate: [AuthGuard] },
  { path: 'add-car-company', component: AddEditCarCompanyComponent, canActivate: [AuthGuard] },
  { path: 'edit-car-company/:id', component: AddEditCarCompanyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCompanyRoutingModule { }
