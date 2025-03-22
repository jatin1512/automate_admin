import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCompanyModelRoutingModule } from './car-company-sub-model-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEditCarCompanySubModelComponent } from './add-edit-car-company-sub-model/add-edit-car-company-sub-model.component';
import { CarCompanySubModelListComponent } from './car-company-sub-model-list/car-comapany-model-list.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [AddEditCarCompanySubModelComponent, CarCompanySubModelListComponent],
  imports: [
    CommonModule,
    CarCompanyModelRoutingModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule
  ],
  providers: [SharedService]
})
export class CarCompanySubModelModule { }
