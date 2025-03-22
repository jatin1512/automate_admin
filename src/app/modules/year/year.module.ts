import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YearRoutingModule } from './year-routing.module';
import { AddEditYearComponent } from './add-edit-year/add-edit-year.component';
import { YearListComponent } from './year-list/year-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [AddEditYearComponent, YearListComponent],
  imports: [
    CommonModule,
    YearRoutingModule,
    SharedModule,
    FormsModule,
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule
  ],
  providers: [SharedService]
})
export class YearModule { }
