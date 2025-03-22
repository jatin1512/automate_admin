import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCompanyModelRoutingModule } from './car-company-model-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEditCarCompanyModelComponent } from './add-edit-car-company-model/add-edit-car-company-model.component';
import { CarCompanyModelListComponent } from './car-company-model-list/car-comapany-model-list.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [AddEditCarCompanyModelComponent, CarCompanyModelListComponent],
  imports: [
    CommonModule,
    CarCompanyModelRoutingModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
  ],
  providers: [SharedService]
})
export class CarCompanyModelModule { }
