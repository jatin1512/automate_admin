import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from './services/local-storage.service';
import { AuthGuard } from './services/authGuard/auth.guard';
import { SharedModule } from './shared/shared.module';
import { AsyncPipe } from '@angular/common';
import { SharedService } from './services/shared.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    
    routes,
    AuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
  ],
  providers: [LocalStorageService, { provide: AuthGuard, useClass: AuthGuard }, AsyncPipe, SharedService],
  bootstrap: [AppComponent],
  exports: [
    HttpClientModule
  ]
})
export class AppModule { }
