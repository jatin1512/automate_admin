import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { AuthGuard } from './services/authGuard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'year',
    loadChildren: () => import('./modules/year/year.module').then(m => m.YearModule)
  },
  {
    path: 'car-company',
    loadChildren: () => import('./modules/car-company/car-company.module').then(m => m.CarCompanyModule)
  },
  {
    path: 'car-company-model',
    loadChildren: () => import('./modules/car-company-model/car-company-model.module').then(m => m.CarCompanyModelModule)
  },
  {
    path: 'car-company-sub-model',
    loadChildren: () => import('./modules/car-company-sub-model/car-company-sub-model.module').then(m => m.CarCompanySubModelModule)
  },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'car',
    loadChildren: () => import('./modules/car/car.module').then(m => m.CarModule)
  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: '**',
    redirectTo: 'auth',
  }
];
