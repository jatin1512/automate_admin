import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarCompanySubModelListComponent } from './car-company-sub-model-list/car-comapany-model-list.component';
import { AddEditCarCompanySubModelComponent } from './add-edit-car-company-sub-model/add-edit-car-company-sub-model.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


const routes: Routes = [
  { path: '', component: CarCompanySubModelListComponent, canActivate: [AuthGuard] },
  { path: 'add-car-sub-model', component: AddEditCarCompanySubModelComponent, canActivate: [AuthGuard] },
  { path: 'edit-car-sub-model/:id', component: AddEditCarCompanySubModelComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCompanyModelRoutingModule { }
