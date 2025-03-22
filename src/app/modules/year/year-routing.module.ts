import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YearListComponent } from './year-list/year-list.component';
import { AddEditYearComponent } from './add-edit-year/add-edit-year.component';
import { AuthGuard } from '../../services/authGuard/auth.guard';


const routes: Routes = [
  { path: '', component: YearListComponent, canActivate: [AuthGuard] },
  { path: 'add-year', component: AddEditYearComponent, canActivate: [AuthGuard] },
  { path: 'edit-year/:id', component: AddEditYearComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearRoutingModule { }
