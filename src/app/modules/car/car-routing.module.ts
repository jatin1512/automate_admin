import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarComponent } from './car/car.component';
import { AddEditCarComponent } from './add-edit-car/add-edit-car.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


const routes: Routes = [
  { path: '', component: CarComponent, canActivate: [AuthGuard] },
  { path: 'add-car', component: AddEditCarComponent, canActivate: [AuthGuard] },
  { path: 'edit-car/:id', component: AddEditCarComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
