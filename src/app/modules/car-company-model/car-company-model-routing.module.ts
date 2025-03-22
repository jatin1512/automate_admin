import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarCompanyModelListComponent } from './car-company-model-list/car-comapany-model-list.component';
import { AddEditCarCompanyModelComponent } from './add-edit-car-company-model/add-edit-car-company-model.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


const routes: Routes = [
  { path: '', component: CarCompanyModelListComponent, canActivate: [AuthGuard] },
  { path: 'add-car-company-model', component: AddEditCarCompanyModelComponent, canActivate: [AuthGuard] },
  { path: 'edit-car-company-model/:id', component: AddEditCarCompanyModelComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCompanyModelRoutingModule { }
