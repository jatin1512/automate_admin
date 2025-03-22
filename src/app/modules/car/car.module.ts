import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRoutingModule } from './car-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEditCarComponent } from './add-edit-car/add-edit-car.component';
import { CarComponent } from './car/car.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [AddEditCarComponent, CarComponent],
  imports: [
    CommonModule,
    CarRoutingModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
  ],
  providers: [SharedService]
})
export class CarModule { }
