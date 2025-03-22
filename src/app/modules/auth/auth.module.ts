import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule  } from 'ngx-bootstrap/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SharedService } from '../../services/shared.service';


@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    TooltipModule .forRoot(),
  ],
  providers: [AuthService, LocalStorageService, SharedService],
})
export class AuthModule { }