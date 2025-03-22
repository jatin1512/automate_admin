import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCompanyRoutingModule } from './car-company-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEditCarCompanyComponent } from './add-edit-car-company/add-edit-car-company.component';
import { CarCompanyListComponent } from './car-company-list/car-comapany-list.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [AddEditCarCompanyComponent, CarCompanyListComponent],
  imports: [
    CommonModule,
    CarCompanyRoutingModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
  ],
  providers: [SharedService]
})
export class CarCompanyModule { }
